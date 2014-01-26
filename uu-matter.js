/**
 * UU-Matter <https://github.com/JWhile/UU-Matter>
 *
 * Copyright (c) 2014 juloo
 *
 * uu-matter.js
 */

// class UUMatter extends Builder
function UUMatter()
{
    this.super('div');

    this.uus = []; // :Array<UU>

    this.life = 0; // :int
    this.score = 0; // :int

    this.frames = 0; // :int
    this.playing = false; // :boolean

    var self = this;

    this.menu = new Builder('div')
            .className('uu-menu')
            .append(new Builder('h1')
                .text('UU-Matter'))
            .append(new Builder('a')
                .className('button')
                .text('Jouer')
                .event('click', function()
                {
                    self.start();
                }));

    this.scoreSpan = new Builder('span')
            .className('uu-counter');

    this.className('uu-matter')
        .append(this.menu)
        .append(this.scoreSpan)
        .append(new Builder('div')
            .className('uu-fabricator'))
        .append(new Builder('p')
            .className('uu-footer')
            .html('Créé par <a href="https://github.com/JWhile" target="_blank">juloo</a>'));

    this.addScore(0);
}
// function start():void
UUMatter.prototype.start = function()
{
    this.menu.css('display', 'none');

    for(var i = 0; i < this.uus.length; ++i)
    {
        this.uus[i].remove();
    }

    this.uus = [];

    this.score = 0;
    this.addScore(0);

    this.life = 20;
    this.damage(0);

    this.frames = 0;
    this.playing = true;

    var self = this;

    var loop = function()
    {
        if(self.playing)
        {
            newFrame(loop);

            if(++self.frames > (60 / (self.score + 1) + 30))
            {
                self.frames = 0;

                self.spawnUU();
            }

            self.update();
        }
    };

    newFrame(loop);
};
// function stop():void
UUMatter.prototype.stop = function()
{
    this.playing = false;

    this.menu.css('display', 'block');
};
// function update():void
UUMatter.prototype.update = function()
{
    for(var i = 0, uu; i < this.uus.length; ++i)
    {
        uu = this.uus[i];

        uu.update();

        if(!uu.exploded && uu.collide(564))
        {
            uu.explode();

            this.damage(2);
        }

        if(uu.removed)
        {
            this.uus.splice(i, 1);

            --i;
        }
    }
};
// function addScore(int score):void
UUMatter.prototype.addScore = function(score)
{
    this.score += score;

    this.scoreSpan.text('x '+ this.score);
};
// function damage(int damage):void
UUMatter.prototype.damage = function(damage)
{
    if(damage >= this.life)
    {
        this.life = 0;

        this.stop();
    }
    else
    {
        this.life -= damage;
    }

    this.css('outline-width', this.life * 3 +'px');
};
// function spawnUU():void
UUMatter.prototype.spawnUU = function()
{
    var uu = new UU(this);

    var pos = (564 - 32) / 2;
    uu.setPos(pos, pos);

    this.uus.push(uu.insert(this));
};
fus.extend(UUMatter, Builder);

// class UU extends Builder
function UU(uuMatter)
{
    this.super('span');

    this.uuMatter = uuMatter; // :UUMatter

    this.x = 0; // :int
    this.y = 0; // :int

    this.aX = Math.random() * 2 - 1; // :float
    this.aY = Math.random() * 2 - 1; // :float

    this.exploded = false; // :boolean
    this.removed = false; // :boolean

    var self = this;

    this.className('uu')
        .event('mouseup', function()
        {
            if(!this.exploded)
            {
                self.removed = true;

                self.uuMatter.addScore(1);

                self.remove();
            }
        });
}
// function update():void
UU.prototype.update = function()
{
    this.setPos(this.x + this.aX, this.y + this.aY)
};
// function explode():void
UU.prototype.explode = function()
{
    this.exploded = true;

    this.css('background-color', 'rgba(255,10,10,0.7)')
        .css('background-image', 'none');

    var self = this;

    setTimeout(function()
    {
        self.removed = true;

        self.remove();

    }, 450);
};
// function collide(int size):boolean
UU.prototype.collide = function(size)
{
    size -= 32;

    return (this.x < 0 || this.x > size || this.y < 0 || this.y > size);
};
// function setPos(int x, int y):void
UU.prototype.setPos = function(x, y)
{
    this.x = x;
    this.y = y;

    this.css('top', this.x +'px')
        .css('left', this.y +'px');
};
fus.extend(UU, Builder);
