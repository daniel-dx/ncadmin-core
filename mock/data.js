
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
        photo: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1517549586&di=fc30a4ae128f3db75ef6518c4eb1abd7&src=http://img.zcool.cn/community/0104c958b69c23a801219c77ba5da2.png',
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
        name: 'helloworld',
        notInFormField: '[remote] i do not in the form'
      }
    };
  },
  '/api/getInfov1': (param) => {
    return {
      data: {
        id: 1,
        info: {
          name: 'helloworld',
          notInFormField: '[remote] i do not in the form'
        }
      }
    };
  },
  '/api/getListData': (param) => {
    return {
      data: [
        {
          id: 1,
          date: '2018-12-12',
          name: 'daniel' + Math.random(),
          address: 'china',
          photo: 'data:image/png;base64,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'
        },
        {
          id: 2,
          date: '2018-10-12',
          name: 'simon',
          address: 'china',
          photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAABL1BMVEX///9AQEAAAADDmGvzybE6IxPCwsNnaGtHR0i9p6m+vr6pqatvcHM2HxDLn3BbXF5hRi7f3NeRxz2UzT3k9fw6NEA+PUACBhChoaE9OkDm+v/BlGU4MEDVtqpxUzj5+fl1SieJXTq2j2RVZj/Z2dlJUEDv7+8mFwzOzs7aw6vhuqR+XkDh6OlHOzSyhlyqflOoj4aTl5s8MizMkH9FSUCHtz5+fn95oT/Wup4kCQAqEgCPdWfJp5OYbEejhnepUEd2Yld3RxzMv7ZZOB1xSDMZEAkeHiIiHBovKCNzQA1xMwBfNhSRhH1LOyzdqpbAf3C2npBsjD9jfj8wMDGArD5OWUCxlXxFVVGMbk2/r6OrqZLHpIBuf3tVY17m18hWbHtsfIuvYVZbTENNWmd5ipF08qoNAAAF+0lEQVRYhe2Ya1/aSBjFuQiBJAUCS0wM5WYIKVKRWoNt1YquaLcoqN0uri21Ld//M+w8M5OQcLGZ4It90aPtL8HknydnztwIhX7rf6aSNB6/wBpLRunpuMb+veZW9H78NPQx4kaj1agtONK0/SeAv9AwsOWgt/H/mmYEBJrtNo/vlQi5uu2gnaegv5Z0pa0wotMRpDTvFH04JdvHmtG0enCZzkQ2IkQ9gRbqKtphV+lFbGWb9K5Ia84OOCWfprbINWkmtELJo5QTCg+76mb3mNAWIRdT0dSjKuLLmHIo4lvqsWdIMdBlZqGK9WDoemyqZ0sUq7OirRnyI6ozogXf5Fjs7JaFHNJ9kLEhb5FEJnQoE3v2Bm5bYC98/PbN29hpplgcjVrb1egLBvBYS+GO0hqNRltbW0UqdIg+QLRtyDUOJuny976HKjpuEHmDHF0sTQpA9il/7HEAMoyDvyYbgcjIbz92aMscXa5USouOfThiZUYjHIHlzRaNOu2LZrTWqPjDX4/EU0dk/Tx2/K7fP/oMqt5XXdrebuFYFjOXlxfr+OKIr/gZkXWsiMo9fAM9PDygf2k14mi91+sRpK1I3A9ap/cnRERU+DgRL/wUd5CGw+FzquHxOmbjqwU/aDp5ydbkmyBJUhNJ0nVd4tPP1xpYa7YaL50X8TVBEvSZOPnGI/IfWBJIENfm9IMJTQxJTB4Uh0zZ3ME8+4IF3cSXcpMJuGGjm5JUkgRrHn3AgsZrkFvrwbaj2SRlG4aZnkfblvhqxhBcGcZFA5pPJpPEEUPiGvNoWrav8OEuk7D9AHIyuUEcsRaY3SBof6szC6PbGN3E5GQT0IYb3bi62r3CRwTtbzIQAG1h9IZJ0OYGRosY3RgMvn8fDHavGlN0z98YYuBmJGjiR5IHtGT+pAXPG8Itg5V0XlAU9Et0i64VJ/NonluQENKMnH0vcHidvAOComOPVTwsPycmgtmGxDcgL9ZwAXo4bzVUKgh8yG2SHhfQgwRYp96KcQifTtA6hC/OXS0I3zHuBoKnXPIA+hgTkIJJHx6HhiRmEzT4YYo777/Po88BbdJWgnIVIW6bYKLHmU1vC8NykgM2SR8a+yTd6q8Ndhf7MbN4b5q8oqA+xC8MexgPIyZEW9ch1HGxv8Boko+FyWsu6/oluX5pcaJgwtiBzGind9agi+xeedF4wG4ugSxTpXKc6KU5q91uT0SuDw04GMw4cgBG37JuIO8qlcpH9K7h/nBn+Nx+fS8Yh8Ni3fZK3Uql2w/jzB4fHTS80Ebj4AhzIyKjGYZoHaKi36Ggt3t0qD+/ePXqJdarC3tm4QTmzXQC7QkqlT/hTU+65dPT2NlZxKuzeuz0tHzECibJi3yEtefOXx+6ZayYC3yKP+l2P1SYqxYwAIpGneZkRNhlu/IYOe3ewcTDim5l3PNGl9ZdrrtKLpc/nLBikT6jJsz8w9MzaThE+xVYGWtou9Gqwi4abUWGd3fs5BOUu8qbr19sdmgfr7irVffCW2PZGjlCkS4fR75+uUzBN0wlaZ8iq9XD6dcAZKWuKwqb29LhO/iq5V/4AiuqUfA9Qldc3zDco/FY8T+Vu1RKiwKHfkTOJc8JCM8CaVa4wMW5uBgXHxVMoj2O/zXNi07LCTkRTjyqXkB0+Nc6fwq0nFcXHOLV4YrofK1zQ4Hy5qfNwhR9uxpazl9ncznKK+zlch2VPKd3LodXQudre7ls7lOenl2jk6xT+CpoGVjZ3E3eedJmFp13wuqqaFpyzSGHw6rcQQ9zCg+IJiVnbwqyJy+0cFkNjs7/jUt+nQ/PSFU7juOB0CopOS/PkknhOSg8GFreROQ9ea5kWnihg0y5VoNV/RoVlu1MO59bcuEG/N6Ug6FlbxQ8fuDg7NXUwAmhjqrqXMkk63Lw8HmiMFOynfXgvZEW7hr5CtdZp+SV0GE1Twq3R77aTNZXGvlI4ZRVALI766uN1+D4HrUbvcOn1+5mXXWWydem8aipnu658twoLzx8EvRyMaOV9Ox6ZpnSrGg97lc8697ut55e/wHzQPa8eiyM0gAAAABJRU5ErkJggg=='
        }
      ],
      page: {
        total: 10
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
