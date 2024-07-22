import { config } from '@/config/config'
import prisma from '@/db'
import { sendEmail } from '@/lib/email'
import { country } from '@/lib/utils'
import { render } from 'jsx-email'
import EmailTemplate from '@/email/EmailTemplate'

const getChangedPrices = (clients) => {
  return new Promise(async (resolve, reject) => {
    const productTitles = await prisma.productTitle.findMany({
      where: {
        lang: clients.lang
      }, include: {
        products: true
      }
    })
    if (productTitles.length === 0) reject('No products to send')

    const productTitlesWithDifference = productTitles.filter((tit) => tit.newPrice !== tit.oldPrice)

    const productsToSend = productTitlesWithDifference.map((product) => {
      console.log(product)
      const sku = product.products[0].product.sku
      const ean = product.products[0].product.ean
      const variantId = product.products[0].product.variantId
      const newPrice = product.newPrice
      const title = product.name
      return { sku, ean, variantId, title, newPrice }
    }).filter(Boolean)
    if (productsToSend.length === 0) {
      reject('No products to send')
    } else {
      resolve({ productsToSend, clients })
    }
  })
}

const sendNotification = ({ productsToSend, clients }) => {
  return new Promise(async (resolve) => {
    for (const client of clients.emails) {
      const html = await render(<EmailTemplate data={...productsToSend} lang={clients.lang}/>)
      await sendEmail({
        to: client, subject: `${config.mailing.subject} ${country(clients.lang)}`, html: `${html}`
      })
      console.log(`Wysłano powiadomienie do - ${clients.lang} - ${client}`)
    }
    resolve(productsToSend)
  })
}

export const notifyClient = async () => {
  const clients = await prisma.mailingList.findMany({
    include: {
      emails: true, country: true
    }
  })
  clients.filter((d) => d.emails.length !== 0).map((dd) => {
    const emails = dd.emails.map((email) => email.email)
    return { lang: dd.country.iso, emails }
  }).forEach(async (client) => await getChangedPrices(client).then((data) => sendNotification(data)).catch(error => console.log(error)))
}
