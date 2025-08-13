const axios  = require("axios");

function sum(a,b){
    return a+b
}
const BACKEND_URL ="http//localhost:3000"

  describe("authentication",()=>{
    test('User is able to sign up only once ', async () => {
        const username ="aditya"+Math.random();
        const password = "123456";
        const response =await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
          username,
          password,
          type:"admin"
        })

        expect(response.statusCode).toBe(200)

        const UpdatedResponse =await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
          username,
          password,
          type:"admin"
        })

        expect(UpdatedResponse.statusCode).toBe(400)
    });
  })
//describe blocks
