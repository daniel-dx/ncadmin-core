
module.exports = {
  // route: data | get data function
  '/api/test/getName': (params) => {
    return {
      name: 'Daniel',
      params: params
    };
  },
  '/api/getDetail': (params) => {
    return {
      data: {
        id: 1,
        username: "apple remote",
        attribute: {
          weight: "300g",
          color: "red"
        },
        tag: ["red", "sweet"],
        attributes: [
          {
            weight: "11g",
            color: "purple"
          },
          {
            weight: "22g",
            color: "green"
          }
        ],
        attributes3: [
          {
            weight: {
              value1: "12g",
              value2: "22g"
            },
            color: {
              value1: "purple1",
              value2: "purple2"
            }
          },
          {
            weight: {
              value1: "78g",
              value2: "88g"
            },
            color: {
              value1: "purple3",
              value2: "purple4"
            }
          }
        ],
        obj: {
          a: {
            a: 1,
            b: 2
          },
          b: {
            a: 3,
            b: 4
          }
        }
      }
    };
  },
  '/api/getInfo': (param) => {
    return {
      data: {
        id: 1,
        name: 'helloworld'
      }
    };
  },
  '/api/getListData': (param) => {
    return {
      data: [
        {
          id: 1,
          date: '2018-12-12',
          name: 'daniel',
          address: 'china',
          photo: 'http://img1.imgtn.bdimg.com/it/u=1195753862,969387509&fm=11&gp=0.jpg'
        },
        {
          id: 2,
          date: '2018-10-12',
          name: 'simon',
          address: 'china',
          photo: 'http://img4.imgtn.bdimg.com/it/u=587623031,2088137249&fm=27&gp=0.jpg'
        }
      ],
      page: {
        total: 2
      }
    }
  },
  '/api/deleteItem': (param) => {
    return param;
  },
  '/api/saveItem': (param) => {
    return param;
  }
};
