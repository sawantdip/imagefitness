import mongoose from 'mongoose';
import {getConfig} from '../server/src/config/env.js';
import {connectDatabase} from '../server/src/config/database.js';
import Content from '../server/src/models/Content.js';
import {seed} from '../server/seed.js';
import {withBranches} from '../server/src/services/siteContent.js';
try {
  await connectDatabase(getConfig().mongoUri);
  const existing=await Content.findOne({key:'site'}).lean();
  if(!existing)await Content.create({key:'site',value:seed});
  else {
    const content=withBranches(existing.value);
    if(!content.branches.some(branch=>branch.name.toLowerCase().includes('ghatkopar'))){
      content.branches.push(seed.branches[1]);
      await Content.updateOne({_id:existing._id},{$set:{'value.branches':content.branches}});
    }
  }
  console.log('Bhandup and Ghatkopar branch content available in Atlas. Other content preserved.');
} finally {await mongoose.disconnect();}
