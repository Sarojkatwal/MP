import React, { Component } from 'react';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();


    this.state = {
      video: {},
      status: '',
      prcvideo: false,
      loaded: false,
      volumeL: 0,
      volumeR: 0,
      volumeT: 0,
      volumeB: 0,
      boundingBox: {}

    };
  }


  componentDidMount() {
    window.addEventListener('scroll', this.getBoundingBox, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.getBoundingBox, true);
  }


  getBoundingBox = () => {
    if (this.myRef.current !== null) {
      this.setState({
        ...this.state,
        boundingBox: this.myRef.current.getBoundingClientRect()
      })

    }

  }

  handleVolume = (e) => {

    this.setState({
      ...this.state,
      [e.target.name]: parseFloat(e.target.value),
      boundingBox: this.myRef.current.getBoundingClientRect()

    })
    // this.myRef1.current.style.border = "2px solid red"
    // console.log(this.boundingBox)
    // console.log("Height=", this.boundingBox.height, "- (", this.state.volumeT, " +", this.state.volumeB, ") / 100 * ", this.boundingBox.height, "=",
    //   this.boundingBox.height - (this.state.volumeT + this.state.volumeB) / 100.0 * this.boundingBox.height
    // )
    // // console.log(this.boundingBox.width - (this.state.volumeL + this.state.volumeR) / 100 * this.boundingBox.width)
    // console.log("Width=", this.boundingBox.width, "- (", this.state.volumeL, " +", this.state.volumeR, ") / 100 * ", this.boundingBox.width, "\n=",
    //   this.boundingBox.width, "- (", this.state.volumeL + this.state.volumeR, ") / 100.0 * ", this.boundingBox.width, "\n=",
    //   this.boundingBox.width, "-", (this.state.volumeL + this.state.volumeR) / 100.0, "* ", this.boundingBox.width, "\n=",
    //   this.boundingBox.width, "-", (this.state.volumeL + this.state.volumeR) / 100.0 * this.boundingBox.width, "\n=",
    //   this.boundingBox.width - (this.state.volumeL + this.state.volumeR) / 100.0 * this.boundingBox.width)

  }


  handleSubmit = async (e) => {
    e.preventDefault()

    var vtype = this.state.video.data.name.split('.')[1]
    if (["mp4", "webm", "ogg", "avi"].includes(vtype)) {
      let formData = new FormData()
      formData.append('file', this.state.video.data)

      this.setState({
        ...this.state,
        prcvideo: true
      })
      const response = await fetch('http://localhost:4000/video', {
        method: 'POST',
        body: formData,
      })

      if (response) {
        // const data = await response.json();
        // console.log(this.state.video.data.name)
        console.log(`http://localhost:4000/video/assets/${this.state.video.data.name.split('.')[0]}.webm`)
        this.setState({
          ...this.state,
          status: response.statusText,
          prcvideo: false,
          loaded: true
        })
      }
      else {
        console.log(response)
      }
    }
    else {
      alert("Upload valid video!!")
    }

  }

  handleFileChange = (e) => {
    this.setState({
      loaded: false,
      prcvideo: false,
      video: {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0],
      },
      status: ''
    })
  }

  clearUpload = () => {
    this.setState({
      video: {},
      status: '',
      prcvideo: false,
      loaded: false
    })
  }

  vsave = async (e) => {
    e.preventDefault()

    var vtype = this.state.video.data.name.split('.')[1]

    if (["mp4", "webm", "ogg", "avi"].includes(vtype)) {
      let formData = new FormData()
      formData.append('file', this.state.video.data)

      this.setState({
        ...this.state,

        prcvideo: true,
      })

      const response = await fetch('http://localhost:4000/savevideo', {
        method: 'POST',
        body: formData,
      })

      if (response) {
        if (response.statusText === "OK") {
          alert("Saved successfully")
          this.setState({
            ...this.state,
            status: response.statusText,
            prcvideo: false,
            loaded: false
          })
        }
        else {
          alert("Couldn't save video.")
        }

      }
    }
    else {
      alert("Upload valid video!!")
    }
  }



  render() {

    return (
      <div className="text-center">

        {
          this.state.loaded ?
            <div className='border border-dark '>
              <h1 className='colorwhite'>Process Output</h1>
              <div className='p-5'>
                <video width="320" height="240" controls>
                  <source
                    src={`http://localhost:4000/video/assets/${this.state.video.data.name.split('.')[0]}.webm`}

                  />
                  Your browser does not support the video tag.
                </video>

              </div>
            </div> :
            (this.state.video.preview ?
              (!this.state.prcvideo ?
                <div className='border border-dark '>
                  <h1 className='colorwhite'>Video preview</h1>
                  <div className='p-5' >

                    <video width="320" height="240" controls ref={this.myRef}>
                      <source
                        src={this.state.video.preview}
                      // type="video/mp4"
                      />
                      Your browser does not support the video tag.

                    </video>


                    <input type="range" className="form-range" name="volumeL" id="customRange1"
                      min="0"
                      max="100"
                      value={this.state.volumeL}
                      onChange={(e) => this.handleVolume(e)}
                    />

                    <input type="range" className="form-range" name="volumeR" id="customRange1"
                      min="0"
                      max="100"
                      value={this.state.volumeR}
                      onChange={(e) => this.handleVolume(e)}
                    />

                    <input type="range" className="form-range" name="volumeT" id="customRange1"
                      min="0"
                      max="100"
                      value={this.state.volumeT}
                      onChange={(e) => this.handleVolume(e)}
                    />

                    <input type="range" className="form-range" name="volumeB" id="customRange1"
                      min="0"
                      max="100"
                      value={this.state.volumeB}
                      onChange={(e) => this.handleVolume(e)}
                    />

                    {this.state.boundingBox &&
                      <>
                        <div style={{
                          position: "fixed",
                          top: this.state.boundingBox.top + this.state.volumeT / 100.0 * this.state.boundingBox.height,
                          left: this.state.boundingBox.left + this.state.volumeL / 100.0 * this.state.boundingBox.width,

                          height: this.state.boundingBox.height - (this.state.volumeT + this.state.volumeB) / 100.0 * this.state.boundingBox.height,
                          width: this.state.boundingBox.width - (this.state.volumeL + this.state.volumeR) / 100.0 * this.state.boundingBox.width,
                          border: "4px solid red",

                        }} />

                      </>
                    }
                  </div>
                </div> :
                <div className="spinner-border colorwhite" />
              ) :
              <>
                <h1 className='colorwhite'>Upload to server</h1>
                <hr></hr>
                <input type='file' name='file' className="btn btn-secondary mb-2" onChange={this.handleFileChange} />
              </>
            )
        }


        <br />
        <button type='submit' onClick={this.handleSubmit} className={!this.state.loaded && this.state.video.preview && !this.state.prcvideo ?
          "btn btn-primary m-2" : "btn btn-disabled m-2 "}>Submit</button>

        <button type='submit' onClick={this.vsave} className={!this.state.loaded && this.state.video.preview && !this.state.prcvideo ?
          "btn btn-primary m-2" : "btn btn-disabled m-2"}>SaveVideo</button>
        {this.state.video.preview &&
          <i className='fa fa-times text-danger clearUpload' onClick={this.clearUpload} />
        }


      </div>
    )
  }
}