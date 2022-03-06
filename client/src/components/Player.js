import React, { Component } from 'react';

export default class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id,
      videoId1: this.props.match.params.id1,
      selectvalue: "video",
      prcvideo: false
    };
  }

  async componentDidMount() {


  }

  changeSelect = (val) => {
    this.setState({
      ...this.state,
      selectvalue: val
    }, alert(val))
  }

  velEst = async () => {
    let formData = new FormData()
    formData.append('file', { filename: this.state.videoId1 })

    this.setState({
      ...this.state,
      prcvideo: true
    })
    const response = fetch('http://localhost:4000/esavedvideo/' + this.state.videoId1, {
      method: 'GET'
    })
    setTimeout(() => {
      this.setState({
        ...this.state,
        prcvideo: false,
        videoId: "assets",
        videoId1: this.state.videoId1.split('.')[0] + '.webm'
      }, () => this.props.history.push('/player/assets/output.webm'))
    }, 7000)
    // if (response) {
    //   // const data = await response.json();
    //   // console.log(this.state.video.data.name)
    //   this.setState({
    //     ...this.state,
    //     prcvideo: false,
    //     videoId: "assets",
    //     videoId1: this.state.videoId1.split('.')[0] + '.webm'
    //   })
    // }
  }

  render() {
    console.log(this.state)
    return (
      <div className="App-header text-center">
        {!this.state.prcvideo ?
          <>
            <div className='border border-dark p-5 '>
              <video controls muted autoPlay crossOrigin="anonymous">
                <source src={`http://localhost:4000/video/${this.state.videoId}/${this.state.videoId1}`}
                // type="video/mp4"
                ></source>
              </video>
            </div>
            <h1 className="text-center">{this.state.videoId1}</h1>

            {this.state.videoId === "videos" &&
              <input type="button" value="Estimate Velocity" className='btn btn-primary m-2'
                onClick={this.velEst} />
            }
            {this.state.videoId === "assets" &&
              <div className="form-group optionchose">

                <select className="form-control" id="sel1" value={this.state.selectvalue} onChange={(e) => this.changeSelect(e.target.value)}>
                  <option value="video">Video</option>
                  <option value="of">Optical Flow</option>
                  <option value="depth">Depth</option>
                  <option value="details">Details of all vehicle</option>
                </select>
              </div>
            }
          </> :
          <>
            <div className="spinner-border colorwhite" />
          </>
        }
      </div >
    )
  }
}