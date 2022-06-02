import React from "react";
import * as ReactDOM from "react-dom/client";

/**
 * Default class to support the plugin.
 */
class Runner {
  private displayElement: HTMLElement;
  private trial: Trial;
  private root: ReactDOM.Root;

  // private root:
  /**
   * Default constructor
   * @param {HTMLElement} displayElement target element for jsPsych display
   * @param {any} trial jsPsych trial data
   */
  constructor(displayElement: HTMLElement, trial: Trial) {
    // Copy and store the plugin configuration
    this.displayElement = displayElement;
    this.trial = trial;

    this.root = ReactDOM.createRoot(this.displayElement);
  }

  /**
   * Validate the configuration passed to the plugin
   * @return {boolean}
   */
  validate(): boolean {
    // All keys must be null or different key values
    let correctCount = 0;
    let keyCount = 0;
    for (const response of this.trial.responses) {
      // Count correct answers and valid attributes
      if (
        response.value !== undefined &&
        response.key !== undefined &&
        response.correct !== undefined
      ) {
        if (response.correct === true) correctCount += 1;
      } else {
        console.error(
          new Error(
            'Invalid "responses" value specified. Ensure each response has a "value", "key", and "correct" value defined.'
          )
        );
        return false;
      }
      // Count keyboard responses
      if (response.key !== null && typeof response.key === "string") {
        keyCount += 1;
      }
    }

    if (correctCount !== 1) {
      console.error(
        new Error(
          "Invalid number of correct responses. There should only be one correct response per set of responses."
        )
      );
      return false;
    } else if (keyCount !== 0 && keyCount !== this.trial.responses.length) {
      console.error(
        new Error(
          `Invalid key configuration. Ensure all values are "null" or all values are a key.`
        )
      );
      return false;
    }

    //  Check the 'confirm' parameter
    if (this.trial.continue.key === null && keyCount > 0) {
      console.error(
        new Error(
          "Cannot not mix-and-match keyboard input for some interactions."
        )
      );
      return false;
    } else if (this.trial.continue.key !== null && keyCount === 0) {
      console.error(
        new Error(
          "Cannot not mix-and-match keyboard input for some interactions."
        )
      );
      return false;
    } else if (this.trial.continue.key !== null) {
      if (
        this.trial.responses.map((r) => r.key).includes(this.trial.continue.key)
      ) {
        console.error(
          new Error(
            "The key to confirm the response must not be assigned to selecting a response also!"
          )
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Render method for the plugin
   * @param {React.ReactNode} content React content to render
   */
  render(content: React.ReactNode) {
    this.root.render(content);
  }

  /**
   * End the trial, unmount the React component then submit data to jsPsych
   * @param {{ selection: string, responseTime: number }} data collected response data
   */
  endTrial(data: { selection: string; responseTime: number }) {
    this.root.unmount();
    jsPsych.finishTrial(data);
  }
}

export default Runner;
