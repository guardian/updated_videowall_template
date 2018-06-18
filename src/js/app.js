import xr from 'xr';
import { videowall } from './modules/videowall'

var key = '1deybJsN9CC3nPpK_PuhQ6EiJzfGaX7f9ZhjjLs23Qr4' 

xr.get('https://interactive.guim.co.uk/docsdata/' + key + '.json').then((resp) => {

	let googledoc = resp.data.sheets;

	new videowall(googledoc)
});

