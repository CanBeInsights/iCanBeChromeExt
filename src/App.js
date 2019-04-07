/*global chrome*/
import React, { Component } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import StarsIcon from "@material-ui/icons/Stars";

import { callUrl, extractWords } from "./utils";
import logo from "./CanBeLogo.png";
import "./App.css";

import mock from "./data.json";

const url = "http://74.82.30.111/extract";
const url2 = "https://615840bf.ngrok.io/extract";

const Wrapper = styled.div`
  text-align: center;
  width: 300px;
  height: 300px;
`;

class App extends Component {
  state = {
    analysisDone: false,
    loading: false,
    interests: []
  };

  handleClick = event => {
    chrome.history.search({ text: "" }, historyData => {
      console.log("Sending history data: ", historyData.slice(0, 30));
      this.setState({ loading: true });

      fetch(url, {
        method: "POST",
        body: JSON.stringify(historyData.slice(0, 30)),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log({ res });
          return res.json();
        })
        .then(result => {
          console.log({ result });
          let words = [];
          if (result) {
            console.log({ sorted: result.sort((a, b) => a.score > b.score) });
            result
              .sort((a, b) => a.score > b.score)
              .forEach(interest => {
                const currentWords = extractWords(interest.label);
                words = words.concat(currentWords);
              });
          }
          this.setState({ loading: false, interests: words });
          chrome.storage.sync.set({ interests: words }, () => {
            console.log("interests stored in sync storage.", words);
          });
          this.setState({ analysisDone: true });
        })
        .catch(error => {
          console.log("handleClick error", error);
          this.setState({ analysisDone: false });
        });

      // Promise.resolve([
      //   {
      //     label: "/technology and computing/operating systems",
      //     score: 0.952262
      //   },
      //   {
      //     label: "/technology and computing/hardware/computer/servers",
      //     score: 0.870526
      //   },
      //   {
      //     label: "/technology and computing/programming languages/javascript",
      //     score: 0.818982
      //   },
      //   {
      //     label: "/technology and computing/programming languages/c and c++",
      //     score: 0.811843
      //   },
      //   {
      //     label: "/technology and computing/software",
      //     score: 0.719035
      //   },
      //   {
      //     label: "/technology and computing/hardware/computer components",
      //     score: 0.709144
      //   },
      //   {
      //     label: "/technology and computing/programming languages/java",
      //     score: 0.670856
      //   },
      //   {
      //     label: "/technology and computing/operating systems/linux",
      //     score: 0.650411
      //   },
      //   {
      //     label: "/business and industrial/business software",
      //     score: 0.650255
      //   }
      // ])
      //   // .then(() => callUrl(url2, historyData.slice(0,30)))
      //   .then(result => {
      //     console.log({ result });
      //     let words = [];
      //     if (result) {
      //       result.forEach(interest => {
      //         const currentWords = extractWords(interest.label);
      //         words = words.concat(currentWords);
      //       });
      //     }
      //     chrome.storage.sync.set({ interests: words }, () => {
      //       console.log("interests stored in sync storage.", words);
      //     });
      //     this.setState({ analysisDone: true });
      //   })
      //   .catch(error => {
      //     console.log("handleClick error", error);
      //     this.setState({ analysisDone: false });
      //   });

      // callUrl(`${"https://cors-anywhere.herokuapp.com/"}${url}`, historyData);
    });
  };

  render() {
    // chrome.history.search({ text: "" }, historyData => {
    //   console.log("Sending history data: ", mock);
    //   Promise.resolve().then(() => callUrl(url2, mock));
    //   // callUrl(`${"https://cors-anywhere.herokuapp.com/"}${url}`, historyData);
    // });

    chrome.runtime.onInstalled.addListener(function() {
      // Store empty array of
      chrome.storage.sync.set({ interests: [] }, function() {
        console.log("interests initialized.");
      });
    });

    const renderContent = () => {
      if (this.state.analysisDone) {
        return (
          <div>
            <div>We believe you have a great potential in these areas:</div>
            <List component="nav">
              {this.state.interests.slice(0,5).map(interest => {
                return (
                  <ListItem button>
                    <ListItemIcon>
                      <StarsIcon />
                    </ListItemIcon>
                    <ListItemText primary={interest} />
                  </ListItem>
                );
              })}
            </List>
          </div>
        );
      } else {
        return (
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <p>Find out what you're most interested in!</p>
            {this.state.loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                onClick={this.handleClick}
                className="analysis-button"
              >
                Start Analysis
              </Button>
            )}
          </div>
        );
      }
    };

    return (
      <Wrapper>
        <header className="App-header">{renderContent()}</header>
      </Wrapper>
    );
  }
}

export default App;
