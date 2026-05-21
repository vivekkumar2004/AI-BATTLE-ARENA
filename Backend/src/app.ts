import express from 'express'
import runGraph from './ai/graph.ai.js'
import cors from 'cors'                                                                                                       

const app = express()



app.use(cors({
      origin : 'http://localhost:5173',
      methods : ["GET","POST"],
      credentials : true

}))

app.use(express.json())

app.get("/", async(req,res)=>
{
      const result = await runGraph("predict the team who will win the ipl 2026 based on current performance")
      res.json(result)

})

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