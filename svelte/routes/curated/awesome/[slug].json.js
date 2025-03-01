import { getTag, JSONresponse } from '../_feedly';

export async function get(req, res) {
	const { slug } = req.params;

	const items = await getTag('Awesome');

	const intSlug = parseInt(slug);
	const filtered = items.filter(function(item) {
		return item.published === intSlug;
	});

	if (filtered.length) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
	
		return res.end(JSON.stringify(filtered[0]));
	}

	res.writeHead(404, {
	    'Content-Type': 'application/json'
	});

	return res.end(JSON.stringify({
		message: `Not found`
	}));

	
};
