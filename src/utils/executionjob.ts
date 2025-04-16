import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'
import {v4 as uuidv4} from 'uuid'
import { Job } from '../types/job'
import { error } from 'console'

const jobs = new Map<string, Job>()
export const getJobStatus = async (id: string): Promise<Job | undefined> => {
    return jobs.get(id); 
  };
export const executePythonJob = async (code: string): Promise<string> => {
    const id = uuidv4();
    const job: Job = {
        id,
        code,
        language: 'python',
        startTime: Date.now(),
        status: 'pending',
        linesExecuted: code.split('\n').length
    };

    jobs.set(id, job);

    const jobDir = path.join(__dirname, '..', 'temp', id);
    fs.mkdirSync(jobDir, { recursive: true });
    fs.writeFileSync(path.join(jobDir, 'main.py'), code);

    job.status = 'running';

    const dockerfileSrc = path.join(__dirname, 'sandbox', 'Dockerfile');
    const dockerfileDest = path.join(jobDir, 'Dockerfile');
    fs.copyFileSync(dockerfileSrc, dockerfileDest);

    return new Promise((resolve, reject) => {
        const dockerCmd = `docker build -t job-${id} ${jobDir} && docker run --rm job-${id}`;
        exec(dockerCmd, { timeout: 5000 }, (err, stdout, stderr) => {
            console.log(`Docker stdout: ${stdout}`);
            console.log(`Docker stderr: ${stderr}`);
            if (err) {
                console.error(`Docker error: ${err.message}`);
                job.status = 'error';
                job.output = err.message || 'Unknown error';
                return reject(id);
            }

            job.status = 'completed';
            job.output = stdout || stderr;
            resolve(id);
        });
    });
};
