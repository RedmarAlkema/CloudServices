const cron = require('node-cron');
const Clock = require('../models/clock');

function startDeadlineChecker() {
    cron.schedule('*/10 * * * * *', async () => { 

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    try {
      const dueTargets = await Clock.find({
        deadline: { $gte: today, $lt: tomorrow },
      });

      dueTargets.forEach(target => {
        console.log(`⏰ Tijd is over! Target ${target.targetId} is klaar.`);
      });

    } catch (err) {
      console.error("❌ Fout bij het checken van deadlines:", err.message);
    }
  });
}

module.exports = startDeadlineChecker;