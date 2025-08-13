const axios  = require("axios");
const { use } = require("react");

// function sum(a,b){
//     return a+b
// }
const BACKEND_URL ="http//localhost:3000"

  describe("authentication",()=>{
    test('User is able to sign up only once ', async () => {
        const username ="kirat"+Math.random();
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


    test('signup request fails if the username is empty', async ()=>{
      const username=`kirat=${Math.random()}`
      const password ="123456"
      
      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        password
      })

      expect(response.statusCode).toBe(400)

    })
    

    test('signin succeds if the username and password are correct',async()=>{
      const username=`kirat-${Math.random()}`
      const password ="123456"

      await axios.post('${BACKEND_URL}/api/v1/signin',{
        username,
        password
      });
      const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
      });
       
      expect(response.statusCode).toBe(200)
      expect(response.body.token).toBeDefined()

    })
    
    test('signin fails if username and password are incorrect',async()=>{
      const username =`kirat=${Math.random()}`
      const password = "123456"
      await axios.post(`${BACKEND_URL}/api/v1/signup`);

      const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username:"wrongusername",
        password
      })
      expect(response.statusCode).toBe(403)
    }
    )


  });

  describe("User metadata endpoint",()=>{
     let token ="";
     let avtarId="";

     beforeAll(async ()=>{
      const username= `kirat-${Math.random()}`
      const password="123456"
      
      await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type:"admin"

      });
      const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
      })
       
      token = response.data.token

      const avtarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avtar`,{
        "imageUrl": "https://encrypted—tbn0.qstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s" ,
          "name": "Timmy"

      })
      avtarId =avtarResponse.data.avtarId


     })
   

      test("User cant update their metadata with a wrong avtar id ",async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
          avatarId:"123123123"
        },{
          headers:{
            "authorization":`Bearer ${token}`
          }
        })
        expect(response.statusCode).toBe(400)
      })

      test("User can update their metadata with the right avtar id", async()=>{ 
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
          avatarId 
        },{
          headers:{
            "authorization":`Bearer ${token}`
          }
      })

      expect(response.statusCode).toBe(200)
    })

      test("User is not able to update their metadata if the auth header is not present", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
          avatarId 
        })
        expect(response.statusCode).toBe(403)
      })

      test("test 3",()=>{
        expect(3).toBe(3)
      })
    
     
  })

  describe("User avatar information",()=>{
    let avtarId;
    let token;
    let userId;
     

    beforeAll(async ()=>{
      const username= `kirat-${Math.random()}`
      const password="123456"
      
       const singupResponse=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type:"admin"

      });

      userId =singupResponse.data.userId
      const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
      })
       
      token = response.data.token

      const avtarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avtar`,{
        "imageUrl": "https://encrypted—tbn0.qstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s" ,
          "name": "Timmy"

      })
      avtarId =avtarResponse.data.avtarId


     })

     test("Get back avatar infromation for a user",async()=>{
      const response=await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

      expect(response.data.avatars.length).toBe(1);
      expect(response.data.avatars[0].userId).toBe(userId);
     })

     test("Available avators lists the recently created avatar",async()=>{
      const response=await axios.get(`${BACKEND_URL}/api/v1/avatars`);
      expect(response.data.avatars.length).not.toBe(0);
      const currentAvatar = response.data.avatars.find(x=>x.id==avatarId);
      expect(currentAvatar).toBeDefined();
     })

  })

  describe("Space information ",()=>{
    let mapId;
    let element1Id;
    let element2Id;
    let token;
    let userId;
    

    beforeAll(async ()=>{
      const username= `kirat-${Math.random()}`
      const password="123456"
      
      const singupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type:"admin"

      });

      

      userId =singupResponse.data.userId
      const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
      })
       
      token = response.data.token
      
      const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer${token}`
        }
      

      });


      const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer${token}`
        }
      
      })
      element1Id = element1.id;
      element2Id = element2.id;

      const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
    "thumbnail": "https://thumbnail.com/a.png",
    "dimensions": "100x200",
    "defaultElements": [{
        elementId: "chair1",
        x: 20,
        y: 20
    }, {
        elementId: "chair2",
        x: 18,
        y: 20
    }, {
        elementId: "table1",
        x: 19,
        y: 20
    }, {
        elementId: "table2",
        x: 19,
        y: 20
    }]
});
 d




    })
  })