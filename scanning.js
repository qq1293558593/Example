/*
author:姜晓旭
date:2018-9-5
*/
//界面加载
$(document).ready(function () {
      //获得图片路径
      var image = new Image();
      image.src = "../images/large_2.jpg";
      var picturepath=image.src;
      //创建Canvas
      var canvas=document.getElementById("canvas");
      context=canvas.getContext('2d');
      var td=document.createElement("td");
      //创建节点
      var newcanvas=document.createElement("canvas");
      var canvasId="canvas"+"_"+0;
      var tdId="td"+"_"+0;
      newcanvas.id=canvasId;
      td.id=tdId;
      var tablediv=document.getElementById("loadbytd");
      tablediv.appendChild(td);
      var tddiv=document.getElementById(""+tdId+"");
      tddiv.appendChild(newcanvas);
      var newcanvas=document.getElementById(""+canvasId+"");
      newcontext=newcanvas.getContext('2d');
      //ajax提交
      $.ajax({
        url:"/api/loading",
        type:"post",
        data:"picturepath="+picturepath,
        dataType:"json",
        success:function(data){
            //渲染页面
            var jsonStr = JSON.stringify(data);
            document.getElementById("textareaoperate").innerHTML=jsonStr;
            var datavalues=data.Faces;
            //解析JSON字符串
            for(var i=0;i<datavalues.length;i++){
                var FaceRectvalue= datavalues[i].FaceRect;
                var left=FaceRectvalue.Left;
                var top=FaceRectvalue.Top;
                var width=FaceRectvalue.Width;
                var height=FaceRectvalue.Height;
                var right=left+width;
                var under=top+height;
                context.drawImage(image,0,0);
                context.moveTo(left,top);
                context.lineTo(right,top);
                context.lineTo(right,under);
                context.lineTo(left,under);
                context.lineTo(left,top);
                context.strokeStyle = 'blue';
                context.stroke();
                newcontext.drawImage(image,left,top,width,height,0,0,100,100);
                newcanvas.onclick=function(){ loadpoint_one(image,picturepath) };
            }
        },
      });
      //点击区域事件
    function  loadpoint_one(image,picturepath) {
        var canvas=document.getElementById("canvas")
        context=canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        $.ajax({
            url:"/api/loading",
            type:"post",
            dataType:"json",
            data:"picturepath="+picturepath,
            success:function(data){
                var jsonStr = JSON.stringify(data);
                document.getElementById("textareaoperate").innerHTML=jsonStr;
                context.strokeStyle = 'blue';
                var datavalues=data.Faces;
                for(var i=0;i<datavalues.length;i++){
                    var FaceRectvalue= datavalues[i].FaceRect;
                    var LandMarkvalue= datavalues[i].LandMark;
                    var left=FaceRectvalue.Left;
                    var top=FaceRectvalue.Top;
                    var width=FaceRectvalue.Width;
                    var height=FaceRectvalue.Height;
                    var right=left+width;
                    var under=top+height;
                    var positionwidth=(600-width)/2;
                    var positionheight=(400-height)/2;
                    context.drawImage(image,left,top,width,height,positionwidth,positionheight,width,height);
                    context.beginPath();
                    for(var key in LandMarkvalue){
                        var value=LandMarkvalue[key];
                        var w=(value.x-left)+positionwidth;
                        var h=(value.y-top)+positionheight;
                        context.fillStyle = 'blue';
                        context.arc(w,h,2,0,Math.PI*2,true);
                        context.fill();
                        context.closePath();
                    }

                }

            },

        });
    }
    //Demo图片点击事件
    $("#_1").click(function(){
        var image = new Image();
        image.src = "../images/large_2.jpg";
        var picturepath=image.src;
        common(image,picturepath);
    });
    $("#_2").click(function(){
        var image = new Image();
        image.src = "../images/large_3.png";
        var picturepath=image.src;
        common(image,picturepath);
    });
    $("#_3").click(function(){
        var image = new Image();
        image.src = "../images/large_4.png";
        var picturepath=image.src;
        common(image,picturepath);
    });
    $("#_4").click(function(){
        var image = new Image();
        image.src = "../images/large_5.png";
        var picturepath=image.src;
        common(image,picturepath);
    });
    //Demo点击事件公共处理方法
    function common(image,picturepath){
        var canvas=document.getElementById("canvas");
        context=canvas.getContext('2d');
        canvas.width=600;
        canvas.height=400;
        var newcanvas=document.getElementById("canvas_0");
        newcontext=newcanvas.getContext('2d');
        newcontext.clearRect(0,0,newcanvas.width,newcanvas.height);
        $.ajax({
            url:"/api/loading",
            type:"post",
            data:"picturepath="+picturepath,
            dataType:"json",
            success:function(data){
                var jsonStr = JSON.stringify(data);
                document.getElementById("textareaoperate").innerHTML=jsonStr;
                var datavalues=data.Faces;
                for(var i=0;i<datavalues.length;i++){
                    var FaceRectvalue= datavalues[i].FaceRect;
                    var left=FaceRectvalue.Left;
                    var top=FaceRectvalue.Top;
                    var width=FaceRectvalue.Width;
                    var height=FaceRectvalue.Height;
                    var right=left+width;
                    var under=top+height;
                    context.drawImage(image,0,0);
                    context.moveTo(left,top);
                    context.lineTo(right,top);
                    context.lineTo(right,under);
                    context.lineTo(left,under);
                    context.lineTo(left,top);
                    context.strokeStyle = 'blue';
                    context.stroke();
                    newcontext.clearRect(0,0,newcanvas.width,newcanvas.height);
                    newcontext.drawImage(image,left,top,width,height,0,0,100,100);
                    newcanvas.onclick = function(){loadpoint_one(image,picturepath)};
                }
            },
        });
    }
    //真正上传的图片做特征分析
    $("#submit").click(function(){
        var filename=document.getElementById("previewlsl");
        if(filename.files&&filename.files[0]){
            var options={
                url:"/api/download",
                type:"post",
                dataType:"json",
                success:function(data)
                {
                    var canvas = document.getElementById("canvas");
                    context = canvas.getContext('2d');
                    var jsonStr = JSON.stringify(data);
                    document.getElementById("textareaoperate").innerHTML=jsonStr;
                    var facevalue=data.Faces;
                    if(facevalue.length==0){
                        $("#divelement").empty();
                        $("#canvas").show();
                        $("#displaypicture").hide();
                        context.clearRect(0,0,canvas.width,canvas.height);
                        context.font="25px Palatino";
                        context.fillText("未检测到人脸,请重新选择一张图片",130,150);
                        $("#loadbytd").empty();
                    }else{
                        $("#canvas").hide();
                        $("#displaypicture").show();
                        $("#loadbytd").empty();
                        $("#divelement").empty();
                        var prevDiv=document.getElementById("displaypicture");
                        var sourcewidth=0;
                        var sourceheight=0;
                        var reader=new FileReader();
                        reader.readAsDataURL(filename.files[0]);
                        reader.onload=function(evt){
                            var data=evt.target.result;
                            var image = new Image();
                            image.src=data;
                            image.onload=function(){
                                sourcewidth = image.width;
                                sourceheight = image.height;
                                prevDiv.src=data;
                                for(var i=0;i<facevalue.length;i++){
                                    var FaceRectvalue= facevalue[i].FaceRect;
                                    var left=FaceRectvalue.Left;
                                    var top=FaceRectvalue.Top;
                                    var width=FaceRectvalue.Width;
                                    var height=FaceRectvalue.Height;
                                    var quotientwidth=sourcewidth/600;
                                    var quotientheight=sourceheight/400;
                                    var actualwidth=width/quotientwidth;
                                    var actualheight=height/quotientheight;
                                    var actualleft=left/quotientwidth+100;
                                    var actualtop=top/quotientheight+200;
                                    var createId="control"+"_"+i;
                                    var span=document.createElement("span");
                                    span.id=createId;
                                    var div=document.getElementById("divelement");
                                    div.appendChild(span);
                                    $("#"+createId+"").css({
                                        width: actualwidth,
                                        height:actualheight,
                                        border:'1px solid blue',
                                        top:actualtop,
                                        left:actualleft
                                    })
                                    var canvasId="canvas"+"_"+i;
                                    var tdId="td"+"_"+i;
                                    var canvas=document.createElement("canvas");
                                    var td=document.createElement("td");
                                    td.id=tdId;
                                    canvas.id=canvasId;
                                    var tablediv=document.getElementById("loadbytd");
                                    tablediv.appendChild(td);
                                    var tddiv=document.getElementById(""+tdId+"");
                                    tddiv.appendChild(canvas);
                                    var newcanvas=document.getElementById(""+canvasId+"");
                                    newcontext=newcanvas.getContext('2d');
                                    newcontext.clearRect(0,0,newcanvas.width,newcanvas.height);
                                    newcontext.drawImage(image,left,top,width,height,0,0,100,100);
                                    newcanvas.onclick = function(){ loadpoint_two($('canvas').index(this)) };
                                }

                            };

                        }

                    }

                },
            };

        }else{
            alert("请选择照片再进行上传操作")
        }
        $("#addform").ajaxSubmit(options);
    })

    function loadpoint_two(i){
        $("#canvas").show();
        $("#displaypicture").hide();
        var canvas = document.getElementById("canvas");
        context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        var imgsrc=document.getElementById("displaypicture").src;
        var image = new Image();
        image.src=imgsrc;
        $("#divelement").empty();
        var jsonvalue=document.getElementById("textareaoperate").value;
        var data=JSON.parse(jsonvalue);
        var datavalues= data.Faces;
        var FaceRectvalue= datavalues[i-1].FaceRect;
        var LandMarkvalue= datavalues[i-1].LandMark;
        var left=FaceRectvalue.Left;
        var top=FaceRectvalue.Top;
        var width=FaceRectvalue.Width;
        var height=FaceRectvalue.Height;
        var right=left+width;
        var under=top+height;
        var positionwidth=(600-width)/2;
        var positionheight=(400-height)/2;
        var actualwidth=width/100;
        var actualheight=height/100;
        context.drawImage(image,left,top,width,height,positionwidth,positionheight,width,height);
        context.beginPath();
        for(var key in LandMarkvalue){
            var value=LandMarkvalue[key];
            var w=(value.x-left)+positionwidth;
            var h=(value.y-top)+positionheight;
            context.fillStyle = 'blue';
            context.arc(w,h,2,0,Math.PI*2,true);
            context.fill();
            context.closePath();
        }

    }
})
