class Command {
  constructor(levelAccess) {
    this.levelAccess = levelAccess;
    //Level 0 = root
    //Level 1 = trusted
    //Level 2 = users
  }

  checkLevelAccess(userLevelAccess) {
    if (userLevelAccess > this.levelAccess) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = { Command };
