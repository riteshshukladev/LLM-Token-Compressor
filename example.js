// example.js
const users = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob',   active: false },
    { id: 3, name: 'Carol', active: true },
  ];
  
  function filterActive(users) {
    return users.filter(u => u.active);
  }
  
  function greet(user) {
    if (user.active) {
      console.log(`Hello, ${user.name}!`);
    } else {
      console.log(`User ${user.name} is inactive.`);
    }
  }
  
  for (let user of filterActive(users)) {
    greet(user);
  }
  
  let x = 10;
  while (x != 0) {
    console.log(x);
    x--;
  }
  