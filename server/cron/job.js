import {CronJob} from 'cron';

export default function(cronPattern, job, stopCb, startNow = true) {
  let newJob;

  try {
    newJob = new CronJob(cronPattern, job, stopCb, startNow);
  } catch (err) {
    console.error("cron pattern not valid:", cronPattern);
  }

  return newJob;
}
