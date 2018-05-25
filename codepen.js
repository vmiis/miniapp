function vm_init(callback){
    //--------------------------------------------------------
    $vm.start_time=new Date().getTime();
    //check and clear localstorage
    var data=''; for(var key in window.localStorage){ if(window.localStorage.hasOwnProperty(key)){ data+=window.localStorage[key]; }}
    if(data.length>3000000) localStorage.clear();
    //set name space
    $VmAPI={};$vm.module_list={};
    //--------------------------------------------------------
    //get hosting path
    var href = window.location.href.split('?')[0];
    var path=href.split('/index.html')[0];
    var lastChar=path[path.length-1];
    if(lastChar=='/') path=path.substring(0,path.length-1);
    $vm.hosting_path=path;
    //--------------------------------------------------------
    $vm.server          ='development';
    $VmAPI.api_base     ='https://cbs.wappsystem.com/dev/';
    $vm.reload='';
    //--------------------------------------------------------
    //load vm framework, vm api and first module
    var load_vmapi   =function(){ load_js($vm.url('https://vmiis.github.io/api/distribution/vmapi.min.js'),load_vm);	}
    var load_vm      =function(){ load_js($vm.url('https://vmiis.github.io/framework/distribution/vmframework.min.js'),init);}
    var init         =function(){
         $vm.init_v3({callback:function(){
            $vm.init_status=1;
            $vm.root_layout_content_slot='content_container_0';
            var content=$('body').find('#D__ID').html();
            $('body').find('#D__ID').remove();
            $('body').prepend("<div id='content_container_0'></div>");
            //$vm.load_module_from_content(content,$vm.root_layout_content_slot);
            callback();
        }})
    }
    //--------------------------------------------------------
    var load_js=function(url,next){
        //this is js loader
        var ver=localStorage.getItem(url+"_ver");
        var txt=localStorage.getItem(url+"_txt");
        //------------------------------------------
        if(ver!=$vm.ver[2] || txt===null){
            console.log((new Date().getTime()-$vm.start_time).toString()+"---"+'loading '+url+'?_='+$vm.ver[2]);
            $.get(url+'?_='+$vm.reload,function(data){
                localStorage.setItem(url+"_txt",data);
                localStorage.setItem(url+"_ver",$vm.ver[2]);
                $('head').append('<scr'+'ipt>'+data+'</scr'+'ipt>');
                next();
            },'text');
        }
        else{ $('head').append('<scr'+'ipt>'+txt+'</scr'+'ipt>'); next(); }
        //------------------------------------------
    }
    //--------------------------------------------------------
    $vm.url=function(text){
        text=text.replace(/__HOST__\//g,$vm.hosting_path+'/');
        text=text.replace(/__COMPONENT__\//g,'https://vmiis.github.io/component/');
        return text;
    }
    //------------------------------------
    var resources=[
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
      "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/themes/redmond/jquery-ui.css",

      "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
      "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/jquery-ui.min.js",
      "https://apis.google.com/js/plusone.js",
      "https://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/jquery.validate.min.js",
      "https://sdk.amazonaws.com/js/aws-sdk-2.1.34.min.js",
      "https://www.gstatic.com/charts/loader.js"
    ];
    //------------------------------------
    var load_resources=function(links){
      for(i in links){
        var e=links[i].split('.').pop();
        if(e=='css'){
          $('head').append("<link rel='stylesheet' href='"+links[i]+"'>");
        }
        else if(e=='js'){
          load_js_link(links[i])
        }
      }
    }
    //------------------------------------
    var load_js_link=function(link){
		$.getScript(link,function(){
			var nm=link.split('/').pop();
			nm=nm.replace(/\./g,'-');
			$vm[nm]=1;
			if(nm=='loader-js'){
				google.charts.load('current', {packages: ['corechart']});
			}
		});
	}
	//------------------------------------
    setTimeout(function (){	$.ajaxSetup({cache:true}); load_resources(resources); },10);
    //------------------------------------
    load_vmapi();
}
//------------------------------------
