// export const extractWords = str => {
//   let reducedStr = str;
//   // Remove first slash if existent
//   if (str.length > 0) {
//     if (str[0] === "/") {
//       reducedStr = reducedStr.substring(1);
//     }

//     // Remove 'and', white space and explode at slash
//     const words = reducedStr
//       .replace(/ and /g, "/")
//       .replace(/ /g, "/")
//       .split("/");
//     return words;
//   }
// };

export const extractWords = str => {
  let reducedStr = str;
  // Remove first slash if existent
  if (str.length > 0) {
    if (str[0] === "/") {
      reducedStr = reducedStr.substring(1);
    }

    // Remove 'and', white space and explode at slash
    const words = reducedStr
      .split("/");
    const lastWord = words[words.length - 1];
    return [lastWord];
  }
};

export const callUrl = async (url, data) => {
  console.log(JSON.stringify(data));
  await Promise.resolve()
    .then(() =>
      window.setTimeout(() => {
        console.log("first step");
      }, 1000)
    )
    .then(() => {
      return [
        {
          label: "/technology and computing/operating systems",
          score: 0.952262
        },
        {
          label: "/technology and computing/hardware/computer/servers",
          score: 0.870526
        },
        {
          label: "/technology and computing/programming languages/javascript",
          score: 0.818982
        },
        {
          label: "/technology and computing/programming languages/c and c++",
          score: 0.811843
        },
        {
          label: "/technology and computing/software",
          score: 0.719035
        },
        {
          label: "/technology and computing/hardware/computer components",
          score: 0.709144
        },
        {
          label: "/technology and computing/programming languages/java",
          score: 0.670856
        },
        {
          label: "/technology and computing/operating systems/linux",
          score: 0.650411
        },
        {
          label: "/business and industrial/business software",
          score: 0.650255
        }
      ];
    })
    .then(result => console.log({ result }));

  await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      console.log({ res });
      return res.json();
    })
    .then(response => console.log("Success:", JSON.stringify(response)))
    .catch(error => console.error("Error:", error));
};
