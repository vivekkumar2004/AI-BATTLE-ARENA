import express from 'express'
import runGraph from './ai/graph.ai.js'
const app = express()

app.get("/", async(req,res)=>
{
      const result = await runGraph("predict the team who will win the ipl 2026 based on current performance")
      res.json(result)

})


export default app;