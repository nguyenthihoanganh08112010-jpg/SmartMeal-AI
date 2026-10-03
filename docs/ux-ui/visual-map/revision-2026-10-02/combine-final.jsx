#target photoshop
(function(){
  var root=File($.fileName).parent;
  var visualMap=root.parent;
  var prevDialogs=app.displayDialogs;app.displayDialogs=DialogModes.NO;
  function write(name,obj){var f=File(root+'/'+name);f.encoding='UTF8';f.open('w');f.write(JSON.stringify(obj));f.close();}
  try{
    var sourceFile=File(visualMap+'/SmartMeal-UX-UI-Flow-Map.psd');
    var source=app.open(sourceFile);
    app.activeDocument=source;
    var dup=source.duplicate('SmartMeal-UX-UI-Flow-Map-2026-10-02');
    dup.resizeCanvas(UnitValue(9800,'px'),UnitValue(15820,'px'),AnchorPosition.TOPLEFT);
    var auto=dup.layerSets.add();auto.name='Sửa tự động';
    var add=app.open(File(root+'/Sua-tu-dong.psd'));
    var imported=add.layerSets[0].duplicate(dup,ElementPlacement.PLACEATBEGINNING);
    add.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument=dup;
    imported.move(auto,ElementPlacement.INSIDE);
    imported.translate(UnitValue(4450,'px'),UnitValue(20,'px'));
    var out=File(visualMap+'/SmartMeal-UX-UI-Flow-Map-2026-10-02.psd');
    var opts=new PhotoshopSaveOptions();opts.layers=true;opts.embedColorProfile=true;opts.alphaChannels=true;
    dup.saveAs(out,opts,false,Extension.LOWERCASE);
    source.close(SaveOptions.DONOTSAVECHANGES);
    write('combine-result.json',{ok:true,output:out.fsName,width:dup.width.as('px'),height:dup.height.as('px')});
  }catch(e){write('combine-error.json',{message:String(e),line:e.line});throw e;}
  finally{app.displayDialogs=prevDialogs;}
})();
