
var fs = require('fs');
var parseXml = require('xml2js').parseString;
var moment = require('moment');
const dateFormat = 'YYYY-MM-DDTHH:mm:ss';
const dateFormatOutput = 'YYYY-MM-DD';

	var parseDirectory = function (destinationFolder) {


	//console.log(facturaArray)
	// body...
	var facturaArray = [];
	var index = 0;
	
	var files = fs.readdir(destinationFolder,function (err,files){
	
	index = files.length;
	if (!err) 
		files.forEach( (fileName)=>{  
			
			readFile(destinationFolder +'/'+ fileName,addFactura);

		});
	else
		throw err; 
	});

	function addFactura(factura)
	{
		facturaArray.push(factura);
		if(facturaArray.length === index) next();

	}

	function next()
	{
		console.log('Termine');

		var filter = filterFacturas(facturaArray);

		var sorted = sortFacturas(filter);

		var lineArray =  [];

		for (var i = sorted.length - 1; i >= 0; i--) {
			lineArray.push(createLineFactura(sorted[i]));
		}

		var stream = fs.createWriteStream('output.txt');

		stream.once('open',function(fd)
		{

			for (var i = lineArray.length - 1; i >= 0; i--) {
				stream.write(lineArray[i]+'\n');
			}

			stream.end()

		});
		
	}

}



function readFile(fileName, cb)
{

	fs.readFile(fileName,'utf-8', (err, data) => {
  		if (err) throw err;

  		parseXml(data, (err,result)=>{ 

  		if (err){
  		console.log(err);
  		return;	
  		} 

  			var fac =createFactura(result,fileName);
  			cb(fac);
  			return fac;
			
  		});

	});
}

function createLineFactura(factura)
{
	var dateOutput = moment(factura.date).format(dateFormatOutput);
	/*if(dateOutput.indexOf('Invalid date'!==-1)){
		console.log('Archivo con error' + factura.fileName);	
		console.log(factura);
	}*/ 
	

	var line = `${factura.tipoDeComprobante},${dateOutput},${factura.rfcEmisor},${factura.rfcReceptor},"${factura.nombreEmisor}","${factura.concepto}",${factura.subtotal},${factura.total}`;
	//var line = `${factura.tipoDeComprobante},${factura.uuid},${dateOutput},${factura.rfcEmisor},${factura.rfcReceptor},"${factura.nombreEmisor}","${factura.concepto}",${factura.subtotal},${factura.total}`;
	return line;
}

function filterFacturas(facturaArray)
{
	var filter = facturaArray.filter((elem,index,self   )=> self.findIndex ((t)=>  {return t.uuid === elem.uuid  }) === index)
	return filter;
}

function sortFacturas(facturaArray)
{
	return facturaArray.sort((a,b)=>{

			if(a.date==b.date) return 0;

			if(a.date>b.date) return 1;

			if(a.date<b.date) return -1	;

		});
}


function createFactura( facturaObject, fileName)
{
	var factura = new Factura();
	try
	{
		
		factura.fileName = fileName;

		var date = facturaObject['cfdi:Comprobante']['$']['Fecha']
		
		console.log('factura ' + facturaObject)

		if(date !== undefined && date.indexOf('2018')!==-1)
		{
			
			var tipoDeComprobante = facturaObject['cfdi:Comprobante']['$']['TipoDeComprobante'];
			var subtotal =  parseFloat(facturaObject['cfdi:Comprobante']['$']['SubTotal']);
			var total = parseFloat(facturaObject['cfdi:Comprobante']['$']['Total']);
			var fecha = facturaObject['cfdi:Comprobante']['$']['Fecha'];
			var emisor = facturaObject['cfdi:Comprobante']['cfdi:Emisor'][0]['$']['Nombre'];
			var rfcEmisor = facturaObject['cfdi:Comprobante']['cfdi:Emisor'][0]['$']['Rfc'];
			var rfcReceptor = facturaObject['cfdi:Comprobante']['cfdi:Receptor'][0]['$']['Rfc'];
			var UUID = facturaObject['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0]['$']['UUID']
			var concepto = facturaObject['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][0]['$']['Descripcion'];

		} else {


			var tipoDeComprobante = facturaObject['cfdi:Comprobante']['$']['tipoDeComprobante'] || facturaObject['cfdi:Comprobante']['$']['TipoDeComprobante'];
			var subtotal =  parseFloat(facturaObject['cfdi:Comprobante']['$']['subTotal'] || facturaObject['cfdi:Comprobante']['$']['SubTotal']);
			var total = parseFloat(facturaObject['cfdi:Comprobante']['$']['total'] || facturaObject['cfdi:Comprobante']['$']['Total']);
			var fecha = facturaObject['cfdi:Comprobante']['$']['fecha'] || facturaObject['cfdi:Comprobante']['$']['Fecha'];
			var emisor = facturaObject['cfdi:Comprobante']['cfdi:Emisor'][0]['$']['nombre']|| facturaObject['cfdi:Comprobante']['cfdi:Emisor'][0]['$']['Nombre'];
			var rfcEmisor = facturaObject['cfdi:Comprobante']['cfdi:Emisor'][0]['$']['rfc'] ||facturaObject['cfdi:Comprobante']['cfdi:Emisor'][0]['$']['Rfc'];
			var rfcReceptor = facturaObject['cfdi:Comprobante']['cfdi:Receptor'][0]['$']['rfc'] || facturaObject['cfdi:Comprobante']['cfdi:Receptor'][0]['$']['Rfc'] ;
			//console.log(facturaObject['cfdi:Comprobante'])
			var UUID = facturaObject['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0]['$']['UUID']
			var concepto = facturaObject['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][0]['$']['descripcion'] || facturaObject['cfdi:Comprobante']['cfdi:Conceptos'][0]['cfdi:Concepto'][0]['$']['Descripcion'] ;

		}
		
		
		factura.tipoDeComprobante = tipoDeComprobante;
		factura.fecha = fecha;
		factura.total = total;
		factura.subtotal = subtotal;
		factura.rfcEmisor = rfcEmisor;
		factura.nombreEmisor = emisor;
		factura.rfcReceptor = rfcReceptor;
		factura.uuid = UUID;
		factura.date = moment(factura.fecha , dateFormat);
		factura.concepto = concepto;

	} catch (err)
	{
		factura.err = true;
		factura.errMessage= err;
		console.log(err);
	}
	finally
	{
		return factura;
	}
}

function Factura()
{
	var 
	 err,
	 errMessage,
	 rfcEmisor,
	 nombreEmisor,
	 rfcReceptor,
	 fileName,
	 fecha,
	 date,
	 isIngreso,
	 uuid,
	 iva,
	 isr,
	 subtotal,
	 tipoDeComprobante,
	 concepto,
	 total = undefined;

	 function getYear(){


	 };
}





exports.parseDirectory = parseDirectory;
