$(function(){

	$('#audio').on('ended', function() {
		$('#audio').src = '1.mp3';
		$('#audio').play();
	})

	$('.scene').hide();
	$('.start_box').show();
	$('.start').on('click',function(){

	function makePoker(){
		var colors=['h','s','c','d'];
		var biao={}
		var poker=[];

		while(poker.length!=52){
			var n=Math.ceil(Math.random()*13);
			var c=colors[Math.floor(Math.random()*4)];
			var v={
				color:c,
				number:n
			}
			if(!biao[c+n]){
				poker.push(v);
				biao[c+n]=true;
			}
		}
		return poker;
	}
	
	function setPoker(poker){
		var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'}
		var index=0;

		for(var i=0,poke;i<7;i++){
			for(var j=0;j<i+1;j++){
				poke=poker[index]
				index+=1;
				$('<div>')
					.attr('id',i+'_'+j)
					.attr('data-number',poke.number)
					.addClass('pai')
					.css('background-image','url(./images/'+dict[poke.number]+poke.color+'.png)')
					.appendTo('.scene')
					.delay(index*30)
					.animate({
					  top:i*40,
					  left:(6-i)*65+j*130+178,
					  opacity:1
					})
			}

		}

		for(;index<poker.length;index++){
			var v=poker[index];
			$('<div>')
				.attr('data-number',v.number)
				.addClass('pai left')
				.css('background-image','url(./images/'+dict[v.number]+v.color+'.png)')
				.appendTo('.scene')
				.delay(index*30)
				.animate({
				  top:430,
				  left:308,
				  opacity:1
				})
		}
	}
	
	setPoker(makePoker());

	//向右换牌
	var moveRight=$('.scene .move-right');
	moveRight.on('click',(function(){
		if($('.left').length==0){
			return;
		}
		var zIndex=1;
		return function(){
			$('.left')
				  .last()
				  .css('z-index',zIndex++)
				  .animate({
				  	left:828
				  })
				  .queue(function(){
				  	$(this).removeClass('left')
				  		   .addClass('right')
				  		   .dequeue()
				  })
		}
	}) () )

	//往左移牌
	var num=0;
	var moveLeft=$('.scene .move-left');
	moveLeft.on('click',(function(){
		
		return function(){
			if($('.left').length>0){
				return;
			}
			num++;
			if(num>3){
				alert('亲，最多3次哦！')
				return;
			}
			//each遍历让牌一张一张左移
			$('.right').each(function(i){
				$(this)
					.css('zIndex',0)
					.delay(i*120)
					.animate({
					  left:180
					})
					.queue(function(){
					  	$(this)
					  		.removeClass('right')
					  		.addClass('left')
					  		.dequeue()
					  })
			})
		}
	}) () )

	//给一个DOM对象 返回数字
	function getNumber(el){
		return parseInt($(el).attr('data-number'))
	}
	//给一张牌 看是否可以点击
	function isCanClick(el){
		var x=parseInt($(el).attr('id').split('_')[0])
		var y=parseInt($(el).attr('id').split('_')[1])
		if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){
			return false;
		}else{
			return true;
		}
	}

	var prev=null;
	//事件委托
	$('.scene').on('click','.pai',function(){

		//如果被压住  直接返回
		if($(this).attr('id') && !isCanClick(this)){
			return;
		}

		var number=getNumber(this);
		//如果是13  直接消除 函数返回
		if(number==13){
			$(this)
				.animate({
					top:0,
					left:800
				})
				.queue(function(){
					$(this).detach().dequeue()
				})
			return;
		}
		if(prev){
			if(getNumber(prev)+getNumber(this)==13){
				prev.add(this)
						.animate({
							top:0,
							left:800
						})
						.queue(function(){
							$(this).detach().dequeue()
						})
			}else{
				if($(this).attr('id')==prev.attr('id')){
					$(this).animate({
					top:'+=20'
					})
				}else{
					$(this).animate({
					top:'-=20'
					})
					$(this).animate({
						top:'+=20'
					})
					prev.delay(400).animate({
						top:'+=20'
					})
				}
				
			}
			prev=null;
		}else{
			prev=$(this);
			$(this)
				.animate({
					top:'-=20'
				})
		}

	})

	//replay
	$('.scene .replay').on('click',function(){
		// location.reload();
		num=0;
		$('.scene .pai').detach();
		setPoker(makePoker());
	})

	$('.instruction').on('click',function(){
		$('.rule')
				  .animate({
				  	top:100
				  })
	})

	$('.close').on('click',function(){
		$('.rule')
				.animate({
				  	top:-500
				  })
	})

	$('.start_box').hide();
	$('.scene').show();
	})


})