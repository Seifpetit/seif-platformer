function Dino() {
	this.w = 40; 
	this.x = 24;
	this.y = 324;
	this.g = 0.8;
	this.vy = 0;
	this.vx = 0;
	this.detect = false;
	this.xForce = 1.3;
	this.yForce = 20;
	this.lifes = 3;
	this.key = 0;

	this.show = function() {
		noStroke();
		fill(0);
		if (this.x < width/3) {
			noFill();
			stroke(3);
			textSize(15);
  			textAlign(CENTER);
  			text("Key : ", width/3, 25);
  			text(this.key, width/3 + 25, 25);
			rect(this.x,this.y,this.w,this.w);
			image(sprite,this.x,this.y,this.w,this.w,0,0,250,250);
		}
		else {
			translate(-(this.x-width/3),0);
			noFill();
			stroke(3);
			textSize(15);
  			textAlign(CENTER);
  			text("Key : ", this.x, 25);
  			text(this.key, this.x + 25, 25);
			rect(this.x,this.y,this.w,this.w);
			image(sprite,this.x,this.y,this.w,this.w,0,0,250,250);
		}
	}
	this.update = function() {
		this.vy += this.g;
		this.y += this.vy;

		this.x += this.vx;
		if (this.vx < -1) {this.vx+=0.7;}
		else if (this.vx > 1) {this.vx-=0.7;}
		else {this.vx = 0;}

		//console.log(this.vx);
	}
	this.up = function() {
		if (this.vy == 0) {
			//console.log("tezgqfd");
			this.vy -= this.yForce;
		}
	}
	this.move = function() {
		if (keyIsDown(68)) {//d
			//this.x += 10;
			if (this.vx < 10) {
				this.vx += this.xForce;
			}
		}
		if (keyIsDown(81)) {//q
			//this.x -= 10;
			if (this.vx > -10) {
				this.vx -= this.xForce;
			}
		}
	}
	this.colision = function() {
		if (this.x < 0) {this.x = 0;}
		/*if(this.x >= width/3) {
			translate(-(this.x-width/3),0);
		}
		//if(this.y < 0){this.y = 0;}
		/*if(this.y > height - (tileSize+this.w)){
			this.y = height - (tileSize+this.w);
			this.vy = 0;
		}*/
		//plafond
		if (this.x + this.w > blocks[614].x && this.x < blocks[614].x + blocks[614].w) {
			if (this.y < blocks[614].y + blocks[614].w && this.y > blocks[614].y) {
				map[614] = 25;
			}
		}
		if (this.x + this.w > blocks[677].x && this.x < blocks[677].x + blocks[677].w) {
			if (this.y < blocks[677].y + blocks[677].w && this.y > blocks[677].y) {
				map[677] = 25;
			}
		}
		//chute
		if (this.x + this.w > blocks[922].x && this.x < blocks[922].x + blocks[922].w) {
			if (this.y + this.w > blocks[922].y && this.y + this.w < blocks[922].y + blocks[922].w) {
				map[922] = 0;
			}
		}
		if (this.x + this.w > blocks[944].x && this.x < blocks[944].x + blocks[944].w) {
			if (this.y + this.w > blocks[944].y && this.y + this.w < blocks[944].y + blocks[944].w) {
				map[944] = 25;
			}
		}
		if (this.x + this.w > blocks[960].x && this.x < blocks[960].x + blocks[960].w) {
			if (this.y + this.w > blocks[960].y && this.y + this.w < blocks[960].y + blocks[960].w) {
				map[960] = 25;
			}
		}
		if (this.x + this.w > blocks[965].x && this.x < blocks[965].x + blocks[965].w) {
			if (this.y + this.w > blocks[965].y && this.y + this.w < blocks[965].y + blocks[965].w) {
				map[965] = 25;
			}
		}
		if (this.x + this.w > blocks[970].x && this.x < blocks[970].x + blocks[970].w) {
			if (this.y + this.w > blocks[970].y && this.y + this.w < blocks[970].y + blocks[970].w) {
				map[970] = 25;
			}
		}
		if (this.x + this.w > blocks[975].x && this.x < blocks[975].x + blocks[975].w) {
			if (this.y + this.w > blocks[975].y && this.y + this.w < blocks[975].y + blocks[975].w) {
				map[975] = 25;
			}
		}
		if (this.x + this.w > blocks[677].x && this.x < blocks[677].x + blocks[677].w) {
			if (this.y + this.w > blocks[677].y && this.y + this.w < blocks[677].y + blocks[677].w) {
				map[677] = 25;
			}
		}
		if (this.x + this.w > blocks[260].x && this.x < blocks[260].x + blocks[260].w) {
			if (this.y + this.w > blocks[260].y && this.y + this.w < blocks[260].y + blocks[260].w) {
				map[260] = 0;
				this.key = 1;
			}
		}
		if (this.x + this.w > blocks[934].x && this.x < blocks[934].x + blocks[934].w) {
			if (this.y + this.w > blocks[934].y && this.y + this.w < blocks[934].y + blocks[934].w) {
				map[934] = 0;
			}
		}
		for (var i = 0; i < map.length; i++) {
			if (map[i] == 1 || map[i] == 2 || map[i] == 25 || map[i] == 16 || map[i] == 6 || map[i] == 27) {
				//////////////////////////////////////////////////////////
				//////////////Detect Y-colision///////////////////////////
				//////////////////////////////////////////////////////////
				if (this.x + this.w + this.vx > blocks[i].x && this.x + this.vx < blocks[i].x + blocks[i].w) {
					if (this.y + this.vy < blocks[i].y + blocks[i].w && this.y + this.vy > blocks[i].y) {
						this.y = blocks[i].y + blocks[i].w;
						this.vy = 0;
						if (map[i] == 6) {
							this.x = 24;
							this.lifes--;
						}
						if (i == 596 && this.key == 1) {
							textAlign(CENTER);
							textSize(150);
							text("Rbe7t ya wejh llou7",this.x+250,height/2);
							noLoop();
						}
						console.log("yoyoyo");
					}///plafond
					if (this.y + this.w + this.vy > blocks[i].y && this.y + this.w + this.vy < blocks[i].y + blocks[i].w) {
						this.y = blocks[i].y - this.w;
						this.vy = 0;
						//console.log("6544");
						if (map[i] == 6) {
							this.x = 24;
							this.y = 324;
							this.lifes--;
						}
					}//chute libre
				}
				
			}
			if (this.y > height) {
				this.x = 24;
				this.y = 324;
				this.lifes--;
			}
		}
		//if ((this.x/tileSize) < 6 && (this.x/tileSize) > 5) {map[201] = 1;}
	}
}
