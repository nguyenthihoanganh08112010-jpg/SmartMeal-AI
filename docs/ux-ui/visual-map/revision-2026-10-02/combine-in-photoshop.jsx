#target photoshop
// Native Photoshop assembly: original document is never saved or modified.
(function(){
var root=File($.fileName).parent, base=root.parent;
var previousDialogs=app.displayDialogs;app.displayDialogs=DialogModes.NO;
function json(v){if(v===null)return 'null';if(typeof v==='string')return '"'+v.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r/g,'\\r').replace(/\n/g,'\\n')+'"';if(typeof v==='number'||typeof v==='boolean')return String(v);var r=[],k;if(v instanceof Array){for(k=0;k<v.length;k++)r.push(json(v[k]));return '['+r.join(',')+']';}for(k in v)if(v.hasOwnProperty(k))r.push(json(k)+':'+json(v[k]));return '{'+r.join(',')+'}';}
function write(name,obj){var f=File(root+'/'+name);f.encoding='UTF8';f.open('w');f.write(json(obj));f.close();}
function bounds(l){var a=[];for(var i=0;i<4;i++)a.push(l.bounds[i].as('px'));return a;}
function structure(container){var a=[];for(var i=0;i<container.layers.length;i++){var l=container.layers[i],v={name:l.name,type:l.typename,visible:l.visible,opacity:l.opacity,blend:String(l.blendMode),bounds:bounds(l)};if(l.typename==='LayerSet')v.children=structure(l);else{v.kind=String(l.kind);if(l.kind===LayerKind.TEXT)v.text=l.textItem.contents;}a.push(v);}return a;}
try{
 var sourceFile=File(base+'/SmartMeal-UX-UI-Flow-Map.psd'),source=null;
 for(var i=0;i<app.documents.length;i++){try{if(app.documents[i].fullName.fsName===sourceFile.fsName)source=app.documents[i];}catch(e){}}
 if(!source)source=app.open(sourceFile);
 app.activeDocument=source;
 var originalSnapshot=structure(source.layerSets.getByName('File gốc'));
 var edited=null;
 for(var di=0;di<app.documents.length;di++){if(app.documents[di].name==='SmartMeal-UX-UI-Flow-Map-2026-10-02')edited=app.documents[di];}
 if(!edited){edited=source.duplicate('SmartMeal-UX-UI-Flow-Map-2026-10-02');edited.resizeCanvas(UnitValue(11000,'px'),UnitValue(22020,'px'),AnchorPosition.TOPLEFT);}
 app.activeDocument=edited;
 var auto=edited.layerSets.getByName('Sửa tự động');
 var references=null;try{references=auto.layerSets.getByName('Bản sao nguồn · chỉ đối chiếu');}catch(e){references=auto.layerSets.add();references.name='Bản sao nguồn · chỉ đối chiếu';}
 var original=edited.layerSets.getByName('File gốc');
 var toCopy=[];for(var j=0;j<original.layers.length;j++){var l=original.layers[j];if(/^(05|06|07|10|09) ·/.test(l.name))toCopy.push(l);}
 for(var j=0;j<toCopy.length;j++){var cp=toCopy[j].duplicate();cp.move(references,ElementPlacement.INSIDE);}
 references.visible=false;
 var update=app.open(File(root+'/update-only.psd'));
 var imported=update.layerSets[0].duplicate(edited,ElementPlacement.PLACEATBEGINNING);
 update.close(SaveOptions.DONOTSAVECHANGES);
 app.activeDocument=edited;
 imported.move(auto,ElementPlacement.INSIDE);
 imported.translate(UnitValue(5600,'px'),UnitValue(0,'px'));
 var preserved=json(originalSnapshot)===json(structure(original));
 if(!preserved)throw Error('Original group native structure changed; refusing to save.');
 var output=File(base+'/SmartMeal-UX-UI-Flow-Map-2026-10-02.psd');
 var options=new PhotoshopSaveOptions();options.layers=true;options.embedColorProfile=true;options.alphaChannels=true;options.annotations=true;
 edited.saveAs(output,options,false,Extension.LOWERCASE);
 write('photoshop-verification.json',{photoshopVersion:app.version,output:output.fsName,originalGroupPreserved:preserved,originalSourceSaved:false,width:edited.width.as('px'),height:edited.height.as('px'),rootGroups:edited.layerSets.length,newGroup:imported.name,referenceCopiesHidden:!references.visible,originalStructure:originalSnapshot});
 // Native composite preview, separate duplicate only. Preserve the actual layered document.
 var preview=edited.duplicate('SmartMeal revision preview');preview.flatten();preview.resizeImage(UnitValue(1100,'px'),undefined,undefined,ResampleMethod.BICUBIC);
 preview.saveAs(File(root+'/photoshop-overview.png'),new PNGSaveOptions(),true,Extension.LOWERCASE);preview.close(SaveOptions.DONOTSAVECHANGES);
 app.activeDocument=edited;
 return 'SAVED '+output.fsName+' | original group unchanged';
}catch(e){write('photoshop-error.json',{message:String(e),line:e.line});throw e;}finally{app.displayDialogs=previousDialogs;}
})();
