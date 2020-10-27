
yyyy.match(/([0-9]{4})/)
mm.match(/([0-1]?[0-9]{1})/)
dd.match(/([0-3]?[0-9]{1})/)

email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)

fontSize.match(/)