import * as sapper from '@sapper/app';
import { googleAnalytics } from 'src/utils/google-analytics.js';

sapper.start({
	target: document.querySelector('#sapper')
});

if (process.env.TRACKING_ID) {
	googleAnalytics(process.env.TRACKING_ID);
}