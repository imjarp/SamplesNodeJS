
var fs = require('fs');
var parseXml = require('xml2js').parseString;
var moment = require('moment');


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
		console.log(filter);
	}

}



function readFile(fileName, cb)
{

	fs.readFile(fileName,'utf-8', (err, data) => {
  		if (err) throw err;

  		parseXml(data, (err,result)=>{ 

  		if (err) throw err;

  			var fac =createFactura(result,fileName);
  			cb(fac);
  			//console.log(facturaArray);
  			return fac;
			
  		});

	});
}

function filterFacturas(facturaArray)
{
	var filter = facturaArray.filter((elem,index,self   )=> self.findIndex ((t)=>  {return t.uuid === elem.uuid  }) === index)
}


function createFactura( facturaObject, fileName)
{
	var factura = new Factura();
	try
	{
		factura.fileName = fileName;
		var tipoDeComprobante = facturaObject['cfdi:Comprobante']['$'].tipoDeComprobante;
		var subtotal =  parseFloat(facturaObject['cfdi:Comprobante']['$'].subTotal);
		var total = parseFloat(facturaObject['cfdi:Comprobante']['$'].total);
		var fecha = facturaObject['cfdi:Comprobante']['$'].fecha;
		var rfcEmisor = facturaObject['cfdi:Comprobante']['cfdi:Emisor'][0]['$']['rfc'];
		var rfcReceptor = facturaObject['cfdi:Comprobante']['cfdi:Receptor'][0]['$']['rfc'];
		var UUID = facturaObject['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0]['$']['UUID']

		
		factura.tipoDeComprobante = tipoDeComprobante;
		factura.fecha = fecha;
		factura.total = total;
		factura.subtotal = subtotal;
		factura.rfcEmisor = rfcEmisor;
		factura.rfcReceptor = rfcReceptor;
		factura.uuid = UUID;
		//console.log(factura);

	} catch (err)
	{
		factura.err = true;
		factura.errMessage= err;
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
	 rfcReceptor,
	 fileName,
	 fecha,
	 year,
	 month,
	 isIngreso,
	 uuid,
	 iva,
	 isr,
	 subtotal,
	 tipoDeComprobante,
	 total = undefined;
}





exports.parseDirectory = parseDirectory;
