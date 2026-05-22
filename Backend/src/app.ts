import express from 'express'
import runGraph from './ai/graph.ai.js'
import cors from 'cors'                                                                                                       

const app = express()



app.use(cors({
      origin : ['http://localhost:5173',
            "https://incredible-tiramisu-ca86f1.netlify.app/"
      ],
      methods : ["GET","POST"],
      credentials : true

}))

app.use(express.json())


app.post("/invoke", async(req,res)=>
{
      const {input} = req.body;
      const result = await runGraph(input);

      res.status(200).json({
            message : "Graph executed successfully",
            success : true  ,
            result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      })

})


export default app;