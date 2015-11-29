var App = React.createClass({
  render: function() {
    return (
      <div id="main" className="ui container">
        <DynamicTable />
      </div>
    )
  }
})

var DynamicTable = React.createClass({
  getInitialState: function() {
    return {
      header: ['header', 'header'],
      table: [
        {
          title: 'Round 1',
          data: ['', '']
        },
        {
          title: 'Origin',
          data: [100, 100]
        }
      ]
    }
  },
  addColumn: function(e) {
    var header = this.state.header;
    var table  = this.state.table;
    header.push('header');
    table.map(function (row) {
      row.data.push('');
    })
    this.setState({
      header: header,
      table: table
    })
  },
  addRow: function(e) {
    var header = this.state.header;
    var table  = this.state.table;
    var newRow = {
      title: 'Round ' + table.length,
      data:  []
    };
    for (var i = 0; i < header.length; i++)
      newRow.data.push('');
    table.splice(0, 0, newRow);
    this.setState({
      header: header,
      table: table
    })
  },
  changeData: function(e, i, j) {
    var header = this.state.header;
    var table  = this.state.table;
    var value  = e.target.value;
    if (i === -1)
      header[j] = value;
    else if (j === -1)
      table[i].title = value;
    else
      table[i].data[j] = value;
    this.setState({
      header: header,
      table: table
    })
  },
  render: function() {
    var app    = this;
    var header = this.state.header;
    var table  = this.state.table;
    var result = [];
    for (var j = 0; j < header.length; j++)
      result.push(0);
    for (var j = 0; j < header.length; j++)
      for (var i = 0; i < table.length; i++)
        result[j] += eval(table[i].data[j]) || 0;
    return (
      <table className="ui center aligned definition selectable table">
        <thead>
        <tr>
          <th></th>
          {
            header.map(function (value, j) {
              return <Cell value={value} header={true} change={app.changeData} row={-1} col={j} />
            })
          }
        </tr>
        </thead>
        <tbody>
        <tr className="active">
          <td>Result</td>
          {
            result.map(function (value) {
              return <td><strong>{value}</strong></td>
            })
          }
        </tr>
        {
          table.map(function (row, i) {
            return (
              <tr>
                <td>{row.title}</td>
                {
                  row.data.map(function (value, j) {
                    return <Cell value={value} header={false} change={app.changeData} row={i} col={j} />
                  })
                }
              </tr>
            )
          })
        }
        </tbody>
        <tfoot>
          <button className="ui labeled icon button" onClick={this.addColumn}>
            <i className="plus icon"></i>
            Add column
          </button>
          <button className="ui labeled icon button" onClick={this.addRow}>
            <i className="plus icon"></i>
            Add Row
          </button>
        </tfoot>
      </table>
    )
  }
})

var Cell = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.value,
      editable: false
    }
  },
  clickHandler: function(e) {
    this.setState({
      editable: !this.state.editable
    })
  },
  blurHandler: function(e) {
    this.props.change(e, this.props.row, this.props.col);
    this.setState({
      value: e.target.value,
      editable: !this.state.editable
    })
  },
  changeHandler: function(e) {
    this.setState({
      value: e.target.value
    })
  },
  componentDidUpdate: function() {
    var row = this.props.row;
    var col = this.props.col;
    $("#input_" + row + "_" + col).focus();
  },
  render: function() {
    var row      = this.props.row;
    var col      = this.props.col;
    var header   = this.props.header;
    var value    = this.state.value;
    var editable = this.state.editable;
    var res;
    if (editable)
      res =
        <div className="ui input">
          <input type="text"
            value={value}
            id={"input_" + row + "_" + col}
            onBlur={this.blurHandler}
            onChange={this.changeHandler} />
        </div>;
    else
      res = value;
    return (
      (header)?
        <th onClick={this.clickHandler}>{res}</th>:
        <td onClick={this.clickHandler}>{res}</td>
    )
  }
})

$(document).ready(function() {
  ReactDOM.render(<App />, document.body);
});