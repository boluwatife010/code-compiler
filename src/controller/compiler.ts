import express, {Request, Response} from 'express'
import { executePythonJob, getJobStatus } from '../utils/executionjob'
import { error } from 'console'

//Handle python compilation'
export const handlePythonJob = async (req: Request, res: Response): Promise<any> => {
    const {code} = req.body
    if (!code) {
        res.status(400).send({message: 'Please provide a valid python code.'})
    }
    try {
        const jobId = await executePythonJob(code)
        if (!jobId) {
            res.status(400).send({message: 'Could not execute the code.'})
        }
        res.status(200).send({message: 'Successfully executed code', jobId})
    }   catch (error) {
      return res.status(500).send({
          message: 'error: Execution failed',
          error: (error instanceof Error ? error.message : undefined),
          jobId: typeof error === 'string' ? error : undefined
      });
  }
}
// Handle get the status of the code
export const handleGetStatus = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Please provide a valid ID.' });
    }
    try {
      const job = await getJobStatus(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found.' });
      }
  
      const now = Date.now();
      const timeRunning = job.startTime ? now - job.startTime : null;
  
      return res.status(200).json({
        id: job.id,
        status: job.status,
        startTime: job.startTime,
        timeRunning,
        linesOfCode: job.code?.split('\n').length || 0,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error: Failed to get status.' });
    }
  };