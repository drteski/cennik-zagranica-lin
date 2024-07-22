import prisma from '@/db'
import { sendEmail } from '@/lib/email'
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

    // const productTitlesWithDifference = productTitles.filter((tit) => tit.newPrice !== tit.oldPrice)
    const productTitlesWithDifference = productTitles.filter((tit) => tit.newPrice !== tit.oldPrice).map(product => {
      const { name, lang, newPrice, oldPrice } = product
      return { title: name, lang, newPrice, oldPrice, ...product.products[0] }
    })

    const productsToSend = productTitlesWithDifference.map((product) => {
      const { title, lang, newPrice, oldPrice, variantId, sku, ean } = product
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
      const html = await render(<EmailTemplate data={...productsToSend} locale={clients.locale} name={clients.name} currency={clients.currency}/>)
      await sendEmail({
        to: client, subject: `${clients.subject} ${clients.name}`, html: `${html}`
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
  clients.filter((client) => client.emails.length !== 0).map((client) => {
    const emails = client.emails.map((email) => email.email)
    return { lang: client.country.iso, name: client.country.name, locale: client.country.locale, currency: client.country.currency, emails, subject: client.subject }
  }).forEach(async (client) => await getChangedPrices(client).then((data) => sendNotification(data)).catch(error => console.log(error)))
}
