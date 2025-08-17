const axios  = require("axios");
const { use } = require("react");
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

      }, {
        headers: {
        "authorization": `Bearer ${token}`
        }
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
    let adminToken;
    let adminId;
    let userToken;
    let userId;
    
    beforeAll(async ()=>{
      const username= `kirat-${Math.random()}`
      const password="123456"
      
      const singupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type:"admin"
      });
      adminId =singupResponse.data.userId
      const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username,
        password
      })       

      adminToken = response.data.token
            const userSingupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username:username+"-user",
        password,
        type:"user"

      });
      userId =userSingupResponse.data.userId
      const userSigninResponse =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username:username+"-user",
        password
      })
       
      userToken = userSigninResponse.data.token
      
      const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer${adminToken}`
        }    

      });

      const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer ${adminToken}`
        }      
      })
      element1Id = element1.id;
      element2Id = element2.id;

      const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
    "thumbnail": "https://thumbnail.com/a.png",
    "dimensions": "100x200",
    "defaultElements": [{
        elementId: element1Id,
        x: 20,
        y: 20
    }, {
        elementId: element1Id,
        x: 18,
        y: 20
    }, {
        elementId: element2Id,
        x: 19,
        y: 20
    }
  ]
},{
  headers:{
    authorization:`Bearer ${adminToken}`
  }
});
 

 mapId=map.id;


    });

  test("User is able to create a space", async () => {
  const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
      name: "Test",
      dimensions: "100x200",
      mapId: mapId
    },{
      header:{
        authorization:`Bearer ${userToken}`
      }
    })

  expect(response.data.spaceId).toBeDefined();
})

  test("User is able to create a space without mapId (empty space)", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimensions": "100x200",
    },{
      header:{
        authorization:`Bearer ${userToken}`
      }
    })

    expect(response.spaceId).toBeDefined()
  })

  test("User is not able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
    },{
      header:{
        authorization:`Bearer ${userToken}`
      }
    })

    expect(response.statusCode).toBe(400)
  })

  test("User is not able to delete a space that doesnt exist", async () => {
  const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`,{
      header:{
        authorization:`Bearer ${userToken}`
      }
    })

  expect(response.statusCode).toBe(400)
})

  test("User is able to delete a space that does exist", async () => {
  const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
    "name": "Test",
    "dimensions": "100x200",
  },{
      header:{
        authorization:`Bearer ${userToken}`
      }
    })

  const deleteReponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`)

  expect(deleteReponse.statusCode).toBe(200)
})
  
  test("User should not be able to delete a space created by another user", async () => {
  const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
    "name": "Test",
    "dimensions": "100x200",
  }, {
    header: {
      authorization: `Bearer ${userToken}`
    }
  })



  const deleteReponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
    header: {
      authorization: `Bearer ${adminToken}`
    }
  })

  expect(deleteReponse.statusCode).toBe(400)
  })

  test("Admin has no spaces initially", async () => {
  const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
    header: {
      authorization: `Bearer ${userToken}`
    }
  });
  expect(response.data.spaces.length).toBe(0)
})
  
  test("Admin has no spaces initially", async () => {
  const spaceCreateReponse = await axios.post(`${BACKEND_URL}/api/v1/space/all`, {
    "name": "Test",
    "dimensions": "100x200",
  }, {
    header: {
      authorization: `Bearer ${userToken}`
    }
  });
  const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
    header: {
      authorization: `Bearer ${userToken}`
    }
  });
  const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateReponse.spaceId);
  expect(response.data.spaces.length).toBe(1)
  expect(filteredSpace).toBeDefined()
})





  })

  describe("Arina endpoints",()=>{
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;
    let spaceId;
    
    beforeAll(async ()=>{
      const username= `kirat-${Math.random()}`
      const password="123456"
      
      const singupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type:"admin"
      });
      adminId =singupResponse.data.userId
      const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username: username,
        password
      })       

      adminToken = response.data.token
            const userSingupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username:username +"-user",
        password,
        type:"user"

      });
      userId =userSingupResponse.data.userId
      const userSigninResponse =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username:username+"-user",
        password
      })
       
      userToken = userSigninResponse.data.token
      
      const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer${adminToken}`
        }    

      });

      const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer ${adminToken}`
        }      
      })
      element1Id = element1.id;
      element2Id = element2.id;

      const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
    "thumbnail": "https://thumbnail.com/a.png",
    "dimensions": "100x200",
    "defaultElements": [{
        elementId: element1Id,
        x: 20,
        y: 20
    }, {
        elementId: element1Id,
        x: 18,
        y: 20
    }, {
        elementId: element2Id,
        x: 19,
        y: 20
    }
  ]
},{
  headers:{
    authorization:`Bearer ${adminToken}`
  }
});
 
 mapId=map.id;

const space = await axios.post(`${BACKEND_URL}/api/v1/`, {
  "name": "Test",
  "dimensions": "100x200",
  "mapId": mapId
}, {headers: {
    "authorization": `Bearer ${userToken}`
}});

spaceId = space.spaceId
    });

    test("Incorrect spaceId returns a 400", async () => {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`,{
        headers:{
          "authorization":`Bearer ${userToken}`
        }
      });
      expect(response.statusCode).toBe(400)
    })

    test("Correct spaceId returns all the elements", async () => {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
        headers:{
          "authorization":`Bearer ${userToken}`
        }
      });
      expect(response.data.dimensions).toBe("100x200")
      expect(response.data.elements.length).toBe(3)
    })

    test("Delete endpoint is able to delete an element", async () => {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
        headers:{
          "authorization":`Bearer ${userToken}`
        }
      });

      await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
      spaceId: spaceId,
      elementId: response.data.elements[0].id
      },{
        headers:{
          "authorization":`Bearer ${userToken}`
        }
    });

      const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`);

      expect(newResponse.data.elements.length).toBe(2)
    })

    test('Adding an element fails if the element lies outside the dimensions', async () => {
      await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
      "elementId": elementId,
      "spaceId": spaceId,
      "x": 10000,
      "y": 210000
      },{
        headers:{
          "authorization":`Bearer ${userToken}`
        }
      });

      expect(newResponse.statusCode).toBe(400)
    })

    test("Adding an element works as expected", async () => {
      await axios.post(`${BACKEND_URL}/a pi/v1/space/element`, {
      "elementId": elementId,
      "spaceId": spaceId,
      "x": 50,
      "y": 20
      },{
        headers:{
          "authorization":`Bearer ${userToken}`
        }
      });

      const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
        headers:{
          "authorization":`Bearer ${userToken}`
        }
      });

      expect(newResponse.data.elements.length).toBe(3)
    })

  })

  describe("Admin Endpoints", () => { 
     
  
    let adminToken;
    let adminId;
    let userToken;
    let userId;
    
    beforeAll(async ()=>{
      const username= `kirat-${Math.random()}`
      const password="123456"
      
      const singupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type:"admin"
      });
      adminId =singupResponse.data.userId
      const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username: username,
        password
      })       

      adminToken = response.data.token
            const userSingupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username:username +"-user",
        password,
        type:"user"

      });
      userId =userSingupResponse.data.userId
      const userSigninResponse =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
        username:username+"-user",
        password
      })
       
      userToken = userSigninResponse.data.token
      
    
    });
    
    test("User is not able to hit admin Endpoints",()=>{
       const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer${userToken}`
        }
      });  
      
      const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
        "thumbnail": "https://thumbnail.com/a.png",
        "dimensions": "100x200",
        "defaultElements": []
      },{
        headers:{
          authorization:`Bearer ${userToken}`
        }
      })
      
    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AR0jt-AzUwDBROFvw&s",
      "name": "Timmy"
      }, {
      headers: {
      "authorization": `Bearer ${userToken}`
      }
    })
      const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AR0jt-AzUwDBROFvw&s",
        }, {
        headers: {
        "authorization": `Bearer ${userToken}`
        }
      })

    expect(elementReponse.statusCode).toBe(403)
    expect(mapResponse.statusCode).toBe(403)
    expect(avatarResponse.statusCode).toBe(403)
    expect(avtarResponse.statusCode).toBe(403)

    })

    test("Admin is able to hit admin Endpoints",()=>{
       const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
       "imageUrl": "https://encrypted—tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zPPTze1Y9rSwbbqB6B2hVkoTN4eerX0IkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
       "width":1,
       "height":1,
       "static": true
      },{
        headers:{
          authorization:`Bearer${adminToken}`
        }    

      });  
      
      const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
        "thumbnail": "https://thumbnail.com/a.png",
        "dimensions": "100x200",
        "defaultElements": []
      },{
        headers:{
          authorization:`Bearer ${adminToken}`
        }
      })
      
    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AR0jt-AzUwDBROFvw&s",
      "name": "Timmy"
      }, {
      headers: {
      "authorization": `Bearer ${adminToken}`
      }
    })
    expect(elementReponse.statusCode).toBe(200)
    expect(mapResponse.statusCode).toBe(200)
    expect(avatarResponse.statusCode).toBe(200)

    })
});