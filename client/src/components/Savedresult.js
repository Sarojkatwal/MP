import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Savedresult extends Component {
    constructor() {
        super();
        this.state = {
            videos: [],
            loading1: true
        };
    }

    componentDidMount() {
        setTimeout(() => this.getAllVideos(), 3000)
    }

    getAllVideos = async () => {
        try {
            const response = await fetch('http://localhost:4000/evideos');
            const data = await response.json();
            this.setState({ videos: [...data], loading1: false });
        } catch (error) {
            console.log(error);
        }
    }

    delete = async (video) => {
        // eslint-disable-next-line no-restricted-globals
        var conf = confirm("Do you want to delete?")
        if (conf) {
            const response = await fetch(`http://localhost:4000/delvideo/${video.poster.split('/').slice(1).join('/')}`)
            if (response.statusText === "OK") {
                alert("Deleted Successfully")
                this.getAllVideos()
            }
            else {
                alert("Couldn't delete video")
            }
        }

    }

    render() {
        const svdo = this.state.videos.length !== 0 ?
            this.state.videos.map(video =>
                <div className="col-md-4 zoom" key={video.id}>
                    <div className="card border-0 ">
                        <img src={`http://localhost:4000/${video.poster}`} alt={video.name} />
                        <div className='staymiddle'>
                            <i className='fa fa-trash text-danger delete' onClick={() => this.delete(video)} />
                            <Link to={`/player/${video.poster.split('/').slice(1).join('/')}`}>
                                <i className='fa fa-play-circle-o play' />
                            </Link>
                        </div>

                        <div className="card-body">
                            <p>{video.name}</p>
                        </div>
                    </div>
                </div>
            ) :
            <div className='spinnerCenter colorwhite'>
                No items
            </div>


        return (
            <div className="container ">
                {!this.state.loading1 ?
                    <div className="row">
                        {svdo}
                    </div>
                    : <div className='spinnerCenter'>
                        <div className="spinner-border colorwhite" />
                    </div>
                }
            </div>
        )
    }
}
