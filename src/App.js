import React, {Component, useState} from 'react'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import { CircularProgress, CssBaseline } from '@material-ui/core'
import Plot from 'react-plotly.js';
import './App.css'

const FileUploader = ({onFileSelect}) => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState("Select CSV File")

  const handleFileInput = (e) => {
      // handle validations
      const file = e.target.files[0]
      setFile(file.name)
      setLoading(true)
      onFileSelect(file)
  }

  return (
      <div className="file-uploader">
          <Button
            variant="outlined"
            // onClick={e => fileInput.current && fileInput.current.click()}
            component="label"
            color="secondary"
            startIcon={loading ? <CircularProgress color="secondary" size={20} /> : <AddIcon />}
          >
            {file}
            <input type="file" accept=".csv" onChange={handleFileInput} hidden />
          </Button>
      </div>
  )
}

const HistogramPlot = ({header, rows}) => {
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'red'},
        },
        {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
      ]}
      layout={ {width: 640, height: 480, title: 'A Fancy Plot'} }
    />
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      loaded: false,
      header: null,
      rows: null
    }
  }

  fileReader = new FileReader()
  // headerKeys = Object.keys(Object.assign({}, ...this.state.array))

  csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index]
        return object
      }, {})
      return obj
    })

    this.setState({rows: array})
    this.setState({header: Object.keys(Object.assign({}, ...array))})
  }

  onFileSelect = (file) => {
    this.setState({file: file})

    // Read file
    if (file) {
      this.fileReader.onload = (event) => {
        const text = event.target.result
        this.csvFileToArray(text)
      }

      this.fileReader.readAsText(file)
    }

    this.setState({loaded: true})
  }

  fileData = () => {
    if (this.state.loaded && this.state.rows) {
      return (
        <table>
          <thead>
            <tr key={"header"}>
              {this.state.header.map((key) => (
                <th>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {this.state.rows.map((item) => (
              <tr key={item.id}>
                {Object.values(item).map((val) => (
                  <td>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        // <HistogramPlot header={this.state.header} rows={this.state.rows} />
      )
    } else {
      return (
        <FileUploader onFileSelect={this.onFileSelect} />
      )
    }
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header"> */}
          <CssBaseline />
          <h1>Clockify Timesheet Analyzer</h1>
          {this.fileData()}
        {/* </header> */}
      </div>
    )
  }
}

export default App
