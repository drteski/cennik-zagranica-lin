import { promisify } from "util";
import { pipeline } from "stream";
import axios from "axios";
import XmlStream from "xml-stream";
import { createWriteStream } from "fs";

export const streamer = async () => {
  const p = promisify(pipeline);
  try {
    const request = await axios.get("https://files.lazienka-rea.com.pl/feed-small.xml", {
      timeout: 0,
      responseType: "stream",
    });
    console.log(request.data);
    // const xmlFileWriteStream = new XmlStream(request);
    // xmlFileWriteStream.on("endElement: strategy", (item) => {
    //   console.log(item.$.id);
    // });
    await p(request.data, createWriteStream(`${process.cwd().replace(/\\/g, "/")}/public/temp/feed.xml`, { flags: "w" }));
    console.log("Download successful!");
  } catch (error) {
    console.error("Download failed.", error);
  }

  // const xml = Readable.from(`${process.cwd().replace(/\\/g, "/")}/public/temp/feed.xml`, "utf8");
  // xml.on("data", (chunk) => {
  //   console.log(chunk);
  // });
  // Strings are too short for gigantic XMLs
  // let data = [];
  //
  // const fileStream = createReadStream(`${process.cwd().replace(/\\/g, "/")}/public/temp/feed.xml`);
  // //
  //
  // console.log(fileStream);

  //
  // xmlFileWriteStream.on("endElement: strategy", (item) => {
  //   console.log(item.$.id);
  // });

  // fileStream.on("data", (chunk) => {
  //   console.log(chunk);
  //   const xmlFileWriteStream = new XmlStream(chunk);
  //   console.log(xmlFileWriteStream);
  // });
  // const lineReader = createInterface({
  //   input: fileStream,
  //   crlfDelay: Infinity,
  // });
  //
  // for await (const line of lineReader) {
  //   data.push(line.trim());
  // }

  // console.log(xml);
};
