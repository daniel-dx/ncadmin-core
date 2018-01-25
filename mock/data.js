
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
        username: "apple",
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
        name: 'helloworld'
      }
    };
  }
};
