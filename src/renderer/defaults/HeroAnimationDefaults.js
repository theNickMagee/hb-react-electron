import medusaSpriteIdle from '../../../assets/chars/medusa/IDLE.png';
import gladiatorSpriteIdle from '../../../assets/chars/glad/IDLE.png';
import medusaSpriteWalk from '../../../assets/chars/medusa/MOVE.png';
import gladiatorSpriteWalk from '../../../assets/chars/glad/WALK.png';
import medusaSpriteAttack from '../../../assets/chars/medusa/ATTACK1.png';
import gladiatorSpriteAttack from '../../../assets/chars/glad/ATTACK.png';

const medusaAnimationCoords = {
  attack: {
    sprite: medusaSpriteAttack, // Reference to your sprite image
    frames: 6,
    coords: {
      0: { x: 0, y: 0, w: 150, h: 125 },
      1: { x: 150, y: 0, w: 150, h: 125 },
      2: { x: 300, y: 0, w: 150, h: 125 },
      3: { x: 450, y: 0, w: 150, h: 125 },
      4: { x: 600, y: 0, w: 150, h: 125 },
      5: { x: 750, y: 0, w: 150, h: 125 },
    },
  },
  idle: {
    sprite: medusaSpriteIdle,
    frames: 6,
    coords: {
      0: { x: 0, y: 0, w: 150, h: 125 },
      1: { x: 150, y: 0, w: 150, h: 125 },
      2: { x: 300, y: 0, w: 150, h: 125 },
      3: { x: 450, y: 0, w: 150, h: 125 },
      4: { x: 600, y: 0, w: 150, h: 125 },
      5: { x: 750, y: 0, w: 150, h: 125 },
    },
  },
  move: {
    direction: 'left',
    sprite: medusaSpriteWalk,
    frames: 4,
    coords: {
      0: { x: 0, y: 0, w: 150, h: 125 },
      1: { x: 150, y: 0, w: 150, h: 125 },
      2: { x: 300, y: 0, w: 150, h: 125 },
      3: { x: 450, y: 0, w: 150, h: 125 },
    },
  },
};

const gladiatorAnimationCoords = {
  // set sprite images for gladiator
  attack: {
    sprite: gladiatorSpriteAttack,
    frames: 6,
    coords: {
      0: { x: 0, y: 0, w: 150, h: 125 },
      1: { x: 150, y: 0, w: 150, h: 125 },
      2: { x: 300, y: 0, w: 150, h: 125 },
      3: { x: 450, y: 0, w: 150, h: 125 },
      4: { x: 600, y: 0, w: 150, h: 125 },
      5: { x: 750, y: 0, w: 150, h: 125 },
    },
  },
  idle: {
    sprite: gladiatorSpriteIdle,
    frames: 6,
    coords: {
      0: { x: 0, y: 0, w: 150, h: 100 },
      1: { x: 150, y: 0, w: 150, h: 100 },
      2: { x: 300, y: 0, w: 150, h: 100 },
      3: { x: 450, y: 0, w: 150, h: 100 },
    },
  },
  move: {
    direction: 'left',
    sprite: gladiatorSpriteWalk,
    frames: 4,
    coords: {
      0: { x: 0, y: 0, w: 150, h: 125 },
      1: { x: 150, y: 0, w: 150, h: 125 },
      2: { x: 300, y: 0, w: 150, h: 125 },
      3: { x: 450, y: 0, w: 150, h: 125 },
    },
  },
};

export { medusaAnimationCoords, gladiatorAnimationCoords };
