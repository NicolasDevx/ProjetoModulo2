import mongoose from "mongoose"
import 'dotenv/config'

mongoose.connect(process.env.URL_MONGOOSE as string).then((value) => {
  console.log(`DB connected: Version ${value.version}`)
})

export { mongoose }
