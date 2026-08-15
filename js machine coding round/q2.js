for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}

// ans : 
// 5
// 5
// 5
// 5
// 5

// 1 sec tk loop khtm ho gya hoga but i = 5 hua toga tbhi to condition 5<5 hit hua hoga to us time i = 5 hai isiliye
// condition i<5 pe v print 5 hi ho rha hai