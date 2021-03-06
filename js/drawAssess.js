function drawAssess(stimulus, participant, condition, input, block) {
    //-----------------DECLARE GLOBAL VARS-----------------
    var canvas = document.getElementById('canvas');
        context = canvas.getContext('2d'); //create the canvas
    var collider_circles = []; //create the array of colliders (area of interest/tigger zones)
    var lastRegion = -1; //variable to hold the last region the mouse was in
    var pics   = []; //array to store picture objects
    var random_order = []; //random order for subjects
    var sounds = []; //array to store audio objects
    var page = stimulus;
	var cursor = document.getElementById('cursor');
	var point = new SAT.Vector(0,0); //placeholder vector for superset of mouse and eyes
	 
    //-----------------HANDLE GAZE CONDITION------------
		if (input =='gaze'){
	  		var clientOrigin = {
	  		  left: window.screenLeft,
	  		  top: window.screenTop
	  		} //not sure why we need to do this

				var gaze_point = new SAT.Vector(0,0); //declare vector to contain gaze coords
				console.log("SET TO GAZEPOINT");
				
			  setInterval(function () { //call the update with gaze_point as input
					point = gaze_point;
						update(collider_circles, gaze_point);
		    }, 100); //set the logging interval

	  		EyeTribe.loop(function(frame){
	  		  // dump.innerHTML = frame.dump();
					locateCursor(frame);	 
				  gaze_point.x = frame.average.x;
					gaze_point.y = frame.average.y;
					isFix = frame.isFixated;
					var row = frame;
					console.log(frame);
				})
				
			 	function locateCursor(frame) {
	  		    locateElement(cursor, frame.average);
	  		}
	  		function locateElement(element, position)
				{		
			//COMMENTED OUT TO REMOVE GAZE CURSOR	
	  		 // element.style.display = 'block';
 // 	  		 element.style.left = (position.x - clientOrigin.left - element.clientWidth / 2) + 'px';
 // 	  		 element.style.top = (position.y - clientOrigin.top - element.clientHeight / 2) + 'px';
	  		}		
		}
    //-----------------HANDLE MOUSE CONDITION-----------
		else //ONLY display the eyes in the gaze condition
		{
    	cursor.style.display = 'none';

	    //-----------------SETUP MOUSE STUFF-----------------
	    var mouse_point = new SAT.Vector(0, 0); //declare a vector to contain the mouse coordinates
	    document.onmousemove = function (mouse) { //define what happens when the mouse moves
	        mouse_point.x = mouse.clientX;
	        mouse_point.y = mouse.clientY;
	    };

		  setInterval(function () {
				point = mouse_point;
	        update(collider_circles, mouse_point);
	    }, 100); //set the logging interval

		}
	  
	//-----------------HOUSEKEEPING---------------------
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false); 
    window.addEventListener("keydown", doKeyDown, true); //add keyboard key listener
    
    //-----------------SETUP DATA STUFF-----------------
    var data = [[]];
    var titles = ["participant", "condition", "block", "input", "stimulus", "timestamp", "xmousex", "ymousey", "region","region_tested","isAnswer","name_tested","name_answered"];
    data.push(titles);	

    //-----------------NOW DRAW STUFF----------------
    drawStuff(); //draw the stimuli to the canvas
    window.sound_num = 0; //set the assessment counter to 0
    sounds[random_order[window.sound_num]].play(); //play the first sound in the random_order_list
    
    //----------------------
    //ONLY CALLED IF WINDOW IS RESIZED (AUTOMATICALLY BASED ON EVENT LISTENER)
    //----------------------
    function resizeCanvas() {
        drawStuff(); //redraw the content if the window is resized
    }
    
    //----------------------
    //CALLED ONCE ON PAGE LOAD + ON EVERY RESIZE
    //----------------------
    function drawStuff() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var nrows = 3;
        var ncols = 3;
		if (input == 'gaze'){
	        var radius = 250;
		}
		else {
			var radius = 60;
		}
        var counter = 0;
        var images  = {};
        pics = getStimulus(page);
        for (i = 1; i <= nrows; i++) {
            for (z = 1; z <= ncols; z++) {
                var right = (i / ncols) * winW - (1 / (nrows * 2)) * winW;
                var down = (z / nrows) * winH - (1 / (ncols * 2)) * winH;
                var the_point = new SAT.Vector(right, down);
              //  drawCircle(right,down,radius); //so we can see the trigger areas

                //now we create an array of collider objects to trigger events from mouse or gaze
                collider_circles.push(new SAT.Circle(the_point, radius));
                var end_ix = collider_circles.length - 1;
                //console.log('collider_circles.length:', i,z);  

                //place centered image
                place_stimuli(right, down, pics[counter], images[counter], counter); 
                counter += 1;
            } //end inner for
        } //end outer for
    }

    //----------------------
    //DEBUGGING HELPER FOR DRAWING COLLIDER CIRCLES
    //----------------------
    function drawCircle(px_right,px_down,radius){
        var c=document.getElementById("canvas");
        var ctx=c.getContext("2d");
        ctx.beginPath();
        ctx.arc(px_right,px_down,radius,0,2*Math.PI);
        ctx.stroke();
    }

    //----------------------
    //CALLED ONCE TO LOAD THE STIMULUS LIST BASED ON PAGE NAME 
    //----------------------
    function getStimulus(stimulus) {
        switch (stimulus) {
        case "training":
            pics = ["elephant", "monkey", "cow","sheep", "zebra" , "hippopotamus",  "goat","penguin","cat"];
            random_order = [1,4,3,8,6,0,2,5,7];//TODO manually randomize random order     
            break;
	      case "flags":
	          pics = ["rwanda","senegal",  "namibia","malawi","mozambique","morocco", "zambia","cameroon",   "tanzania" ];
	          random_order = [8,1,4,3,7,0,6,5,2]; 
	          break;
        case "fish":
            pics = ["lesser.weaver","monkfish", "scab", "herring","salmon","cod",  "mackeral",  "haddock", "halibut",];
            random_order = [1,4,3,8,6,0,2,5,7];
            break;
        case "mushrooms":
            pics = ["sulfur.tuft","livid.enteloma", "deadly.fibercap", "death.cap", "ivory.funnel",  "fly.agaric",  "cortinar","yellow.staining","destroying.angel",];
            random_order = [0,3,8,5,7,1,4,6,2];    
            break;
        case "viruses":
            pics = ["herpesvirus","hantavirus","coronavirus",   "hepatitusvirus", "smallpoxvirus",  "rhinovirus","mastadenovirus", "rabiesvirus","filovirus"];
            random_order = [8,1,4,3,7,0,6,5,2];     
            break;
        }
        return pics;
    }

    //----------------------
    //CALLED ONCE TO LOAD EACH IMAGE AND SOUND (BY DRAWSTUFF)
    //----------------------
    function place_stimuli(px_right, px_down, img_name, base_image, counter) {
        base_image = new Image();
        base_image.onload = function () {
            context.drawImage(base_image, px_right - (this.width / 2), px_down - (this.height / 2));
        };
        base_image.src = "img/" + page + "/" + img_name + ".png";
        sounds[counter] = new Audio("img/" + page + "/" + img_name + ".mp3");
    }

    //----------------------
    ///CALLED EVERY FEW MS BASED ON setInterval 
    //----------------------
    function update(collider_circles, point) {
        var currRegion = -1; //reset the current region to null on each update   

        //SET currRegion TO COLLIDER THAT POINT IS IN
				for (var key in collider_circles) //for each collider 
        {
            //is the pointer in it?
            var isColliding = SAT.pointInCircle(point, collider_circles[key]);
            if (isColliding) //if so
            {
                currRegion = key; //set the current region = the collider number
								document.getElementById("d"+key).innerHTML="<img src=img/highlight.png>";
            }
						else{
							document.getElementById("d"+key).innerHTML="";
						}
        }
        document.title = currRegion; //change doc title
				var answer_key_hit;
				
        if(arguments.length === 3 )
				{
					 answer_key_hit = 1;
				}
				else {
				   answer_key_hit = '';
				}

        lastRegion = currRegion; //prepare for next update by setting lastRegion = currentRegion
       

			  var row = [participant, condition, block, input, stimulus, Date.now(), point.x, point.y, 
					parseInt(currRegion), random_order[parseInt(window.sound_num)], answer_key_hit, pics[random_order[parseInt(window.sound_num)]],pics[parseInt(currRegion)]];
        // console.log(row);
        data.push(row);			
	    }

    //----------------------
    ///CALLED EVERYTIME A KEY IS PRESSED 
    //----------------------
    function doKeyDown(e) {                
        switch (e.keyCode) {
            case 32:
            	//get the region
            	update(collider_circles, point, true); 
            	//trigger the next sound
            	
							if (window.sound_num <8)
						{ window.sound_num = window.sound_num + 1; 
            	sounds[random_order[window.sound_num]].play();
            	console.log('window.sound_num:', window.sound_num);
						}
						else {alert("Great Job!  Press ENTER to continue");}
						break;
            case 13:
            	//console.log("ENTER KEY PRESSED");	
					  	saveData(data,block,condition,"test",input,stimulus,participant);
            	window.location.href = "blockstart.html?participant=" + participant + "&condition=" + condition + "&block=" + block + "&input=" + input + "&stimulus=" + stimulus;
            break;
        }
    }
}