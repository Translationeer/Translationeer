import React from "react";
import { LangContext } from "../../services/context";
import Link from "next/link";

//PROPS: Object() document, the current document, Function() breakOffFunction, Function() copyTranslation.
class StudioHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      breakOffText: "",
      breakOffIndex: -1,
      sectionTexts: [],
    };
  }

  changeTextEnd = (e) => {
    var sliderValue = Number(e.target.value);
    this.context.updateTextEnd(sliderValue);
    const leftStudioDOM = document.getElementById("left-studio");
    const rightStudioDOM = document.getElementById("right-studio");
    const min = 30;
    const max = 70;

    if (this.context.isMobile) {
      leftStudioDOM.style.width = "100%";
      rightStudioDOM.style.width = "100%";
    } else {
      if (sliderValue < min) {
        leftStudioDOM.style.width = min + "%";
        rightStudioDOM.style.width = Number(100 - min) + "%";
      } else if (sliderValue > max) {
        leftStudioDOM.style.width = max + "%";
        rightStudioDOM.style.width = Number(100 - max) + "%";
      } else {
        leftStudioDOM.style.width = sliderValue + "%";
        rightStudioDOM.style.width = Number(100 - sliderValue) + "%";
      }
    }
  };

  //Returns the INDEX of the section it is in, NOT a boolean
  breakOffIndex = (text) => {
    var index = -1;
    var num = 0;
    this.setState({ breakOffText: text });
    this.state.sectionTexts.forEach((e) => {
      e = e.replaceAll(this.context.linebreakCode, " ");
      if (e.includes(text)) {
        index = num;
      }
      num++;
    });

    if (index != -1) return index;

    //check with last characters removed, if they are excess spaces
    text = text.replace(/[ |\n]*$/gi, "");

    num = 0;
    this.state.sectionTexts.forEach((e) => {
      e = e.replaceAll(this.context.linebreakCode, " ");
      if (e.includes(text)) {
        index = num;
      }
      num++;
    });

    if (index != -1) {
      this.setState({ breakOffText: text });
    }

    return index;
  };

  componentDidMount() {
    if (this.context.isMobile)
      document.getElementById("right-studio").style.display = "none";
    if (!this.props.document || !this.props.document.body) return;
    this.changeTextEnd({
      target: {
        value: this.context.isMobile ? 100 : 50,
      },
    });

    var arr = [];

    this.props.document.body.forEach((e) => arr.push(e.text));
    this.setState({ sectionTexts: arr });

    //HERE IS WHERE YOU ANALYZE HIGHLIGHTED TEXT.
    window.onmouseup = () => {
      // console.log("Selection: ", window.getSelection().toString());

      //IMPORTANT: replace all types of line breaks (including carriage) with nothing and all non breaking space &nbsp; with a whitespace. &nbsp; is NOT the same as a whitespace

      var selectedText = window
        .getSelection()
        .toString()
        .replaceAll(/(\r\n|\n|\r)/gm, "")
        .replaceAll(/[\s\u00A0]/gm, " ");
      if (this.state.breakOffText !== selectedText) {
        if (!selectedText) {
          this.setState({
            breakOffText: "",
            breakOffIndex: -1,
          });
        } else {
          this.setState({
            breakOffIndex: this.breakOffIndex(selectedText),
          });
        }
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.props.document || !this.state.sectionTexts) return;
    //using length to measure whether it changed is not ideal, come back here.
    if (
      prevProps.document.body &&
      prevProps.document.body.length != this.state.sectionTexts.length
    ) {
      this.setState({
        sectionTexts: this.props.document.body.map((d) => d.text),
      });
    }
  }

  breakOff = () => {
    this.props.breakOffFunction(
      this.state.breakOffText,
      this.state.breakOffIndex
    );
    this.setState({ breakOffIndex: -1 });
    // this.props.breakOffFunction(
    //   this.state.breakOffText,
    //   this.state.breakOffIndex
    // );
  };

  mobileToggleTranslation = () => {
    var rightStudioDOM = document.getElementById("right-studio");
    if (rightStudioDOM.style.display == "none") {
      rightStudioDOM.style.display = "block";
    } else {
      rightStudioDOM.style.display = "none";
    }
  };

  backToDashboard = () => {
    this.setState({ redirect: "/dashboard" });
  };

  render() {
    return (
      <div id="studioHeader-container">
        <section id="studioHeader-topRow">
          <Link href="/dashboard">
            <a class="arrow-button" id="back-to-documents">
              <span>{"<<<"}</span>Back to Dashboard
            </a>
          </Link>
          <button onClick={this.props.copyTranslation} id="copyTranslation">
            Copy Translation
          </button>
        </section>

        <div id="slidecontainer">
          <input
            type="range"
            min="0"
            max="100"
            className="slider"
            id="textEnd-slider"
            onChange={this.changeTextEnd}
          />
        </div>

        <section id="studioHeader-row">
          <div id="break-off-text-container">
            {this.state.breakOffIndex > -1 && (
              <div id="preview-breakoff">
                "
                {this.state.breakOffText.length > 40
                  ? this.state.breakOffText.substr(0, 40) + "..."
                  : this.state.breakOffText}
                "
              </div>
            )}
            {this.state.breakOffIndex > -1 ? (
              <button
                type="button"
                className="break-off-text"
                onClick={this.breakOff}
              >
                Break Off Text
              </button>
            ) : (
              <div></div>
            )}
          </div>
          <button onClick={this.mobileToggleTranslation} id="show-translation">
            Show Full Translation
          </button>
        </section>
      </div>
    );
  }
}
StudioHeader.contextType = LangContext;

export default StudioHeader;

/*<div id="slidecontainer">
          <input
            type="range"
            min='0'
            max='100'
            className="slider"
            id="textEnd-slider"
            onChange={this.changeTextEnd}
          />
        </div>*/
