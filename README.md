![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# pacman-clone

![image](https://user-images.githubusercontent.com/49749612/65820099-0528ce00-e21d-11e9-8ff8-f82e195a6171.png)

This was a project assigned to me by General Assembly during a software engineering immersive course. The purpose of the project was to solidify the skills we learnt in the first 4 weeks by putting them to use in a project of our choice.

It is a pacman clone in which i attempted to recreate the original games logic using common web development technologies.

## Built With

1. HTML5
2. CSS3
3. JavaScript
4. GitHub

## Deployment

The game is deployed on GitHub pages and it can be found here- https://lloydnoone.github.io/pacman-clone/

## Getting Started

Use the clone button to download the game source code. Open the index.html file in your browser and the game should start, if not check console for any issues. The assets used in this game are stored in the assets folder. They inlcude gifs, png files and fonts.

## Game Architecture

The goal in pacman is for the player to collect all the pips to complete the level. While doing this the player has to avoid ghosts. if the ghosts catch the player it is game over.

![](ezgif.com-video-to-gif.gif)

The ghosts have 3 modes of movement. 

* Chase
  > In chase the ghosts target pacman by comapring their postion to pacmans position on the gameboard in a staight line. This means they sometimes go the wrong way and is an intentional part of the game mechanics.
  
* scatter
  > In scatter, the ghosts will go to there respective corner and circle around until after a few seconds they put back in chase mode.
  
* frightened 
  > firghtened mode is activated when pacman eats the larger energizer dots. In this mode the ghosts take random turns and      move more slowly. This gives pacman a chance to chase down the ghosts and eat them for extra points.
  
A timer changes the ghosts from chase to scatter. because of this the ghosts attack in waves. The time remaining in each mode is remembered during frightened mode so that they go back to there previous state and carry on where they left off.

an example of the ghosts movement function-

```javascript
moveAmount(newIdx) {
      //remove cssClass from this cell before moving
      cells[this.ghostIdx].classList.remove(this.cssClass)
      //save reference to check next move
      this.previousIdx = this.ghostIdx
      // move the actual index by amount passed in
      this.ghostIdx = newIdx
      //place cssClass on new cell
      cells[this.ghostIdx].classList.add(this.cssClass)
    }
    checkNextIdx(nextIdx) {
      //check for wall and previous index
      return (cells[nextIdx].classList.contains('wall') === false && cells.indexOf(cells[nextIdx]) !== this.previousIdx)
    }
    checkTunnelMove() {
      if (this.ghostIdx === 200) {
        cells[this.ghostIdx].classList.remove(this.cssClass)
        this.ghostIdx = 218
        this.previousIdx = 219
      }
      if (this.ghostIdx === 219) {
        cells[this.ghostIdx].classList.remove(this.cssClass)
        this. ghostIdx = 201
        this.previousIdx = 200
      }
    }
    moveCloser() {
      //if ghost on the edge tile of a tunnel, transfer to other side
      this.checkTunnelMove()
      //get player and ghost coords
      const targetX = cells[this.targetIdx].getBoundingClientRect().left
      const ghostX = cells[this.ghostIdx].getBoundingClientRect().left
      const targetY = cells[this.targetIdx].getBoundingClientRect().top
      const ghostY = cells[this.ghostIdx].getBoundingClientRect().top
      // check up, if there is no wall and not previous position, move there
      if (this.checkNextIdx(this.ghostIdx - width) && ghostY > targetY) {
        //move up
        this.moveAmount(this.ghostIdx - width)
      } else if (this.checkNextIdx(this.ghostIdx + width) && ghostY < targetY) {
        //check down, if poss move there
        this.moveAmount(this.ghostIdx + width)
      } else if (this.checkNextIdx(this.ghostIdx - 1) && ghostX > targetX) {
        //check left, if poss move there
        this.moveAmount(this.ghostIdx - 1)
      } else if (this.checkNextIdx(this.ghostIdx + 1) && ghostX < targetX) {
        //check left, if poss move there
        this.moveAmount(this.ghostIdx + 1)
      }
    }
```

Upon eating all the pips, the player wins and is moved on to the next level. The stage is the same but the ghosts will now be moving faster. the ghosts speed will increase everytime the stage is cleared. 

## Wins and Blockers

The main challenge in this project was to get all the information we need by making correct API calls in an efficient way. 

The part where i spent the most time and had the most difficulty was correctly mapping though nested objects and arrays in which, each level of nested data could also be an object or array.  

A big win for me on this project was getting experience pair coding with somebody else. It was a new experience for me. My fears were proved wrong and me and Chawit both agree that we worked very well together and we are both more than happy with the end result.

## Future Features

The main future improvement for the project would be moslty styling. the way the filtered result of city and cuisine is displayed to the user is not great. I would change this to a scrollable dropdown list and aim or something that more closely resembles the Zomato website. Some of the code should be refactored into seperate components.

## Key Learnings

With less than 48hrs time management was again, a big factor in this project. In order to make use of the time as effectively as we could, division of labour was important and things like coordinating our breaks helped. 

We used a screen sharing plugin for vscode to imporve productivity but hand problems when both trying to contribute at the same time. It was buggy and we ended up with a lot of confusion when working with the same file and sometimes even when working in seperate files. 

It was also my first experience working with public APIs. I realised the importance of choosing the correct API by looking at popularity, quality of documentation and whether it was suitable for our needs. I also gained experience in drilling down into multiple nested fields of objects and arrays in order to get what we need from the JSON.

![](leveleditor.gif)

## Author 

Lloyd Noone - portfolio: lloydnoone.com
