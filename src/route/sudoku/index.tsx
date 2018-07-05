import * as React from 'react';
import styles from './index.module.scss';
import { Button, Row, Col, Input } from 'antd';
import * as sudokuKit from './sudoku';
import { InputProps } from 'antd/lib/input';

const Unit: React.StatelessComponent<{ className?: string }> = (props) => (
  <Col span={8}  {...props} className={`${styles.unit} ${props.className || ''}`} />);
// const Box = (props: React.Props<{}>) => <Col span={8} className={styles.box} {...props} />;
const Inputer: React.StatelessComponent<InputProps> = (props) => (
  <Input
    className={styles.inputer}
    maxLength={1}
    {...props}
  />
);

function resetSudoku(): Array<SudokuUnitData[]> {
  const data: Array<number[]> = sudokuKit.initial(5);
  return data.map(arr => arr.map((value: number) => {
    return {
      value,
      editable: value === 0,
    };
  }));
}

class SudokuView extends React.Component {
  state: SudokuViewState = {
    dataSource: resetSudoku(),
    errorIdxs: [],
  };
  componentWillMount() {
    this.state.dataSource = resetSudoku();
  }
  onInputerChange = (dataCtx: SudokuUnitData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dataCtx.value = +e.target.value;
    this.forceUpdate();
  }
  onLogData = () => {
    this.state.dataSource
      .map(arr => arr.map(({ value }) => value).join(', '));
      // .map(s => console.log(s));
  }
  onCheck = () => {
    const dataSource = this.state.dataSource;
    const res = sudokuKit.check(dataSource.map(row => row.map((data: SudokuUnitData) => data.value)));
    // console.log(`sudokit res: `, res);
    if (res !== true) {
      this.setState({
        errorIdxs: (res as Array<[number, number]>).map(([r, c]) => `${r},${c}`),
      });
    } else {
      this.setState({ errorIdxs: [] });
      window.alert('成功');
    }
  }
  onReset = () => {
    this.setState({ dataSource: resetSudoku(), errorIdxs: [] });
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <Row className={styles.pannel}>
          {
            this.state.dataSource
              .map((arr, idx) => arr.map((data: SudokuUnitData, idx1) => {
                const { value, editable } = data;
                const hasErr = this.state.errorIdxs.indexOf(`${idx},${idx1}`) !== -1;
                return (
                  <Unit
                    key={`${idx}_${idx1}`}
                    className={`${!editable ? styles.hint : ''} ${hasErr && editable ? styles.err : ''}`}
                  >
                    {editable ?
                      <Inputer onChange={this.onInputerChange(data)} value={value === 0 ? '' : value} /> :
                      value
                    }
                  </Unit>
                );
              }))
          }
        </Row>
        <Button onClick={this.onCheck}>检查</Button>
        <Button onClick={this.onReset}>重置</Button>
      </div>
    );
  }
}

interface SudokuViewState {
  dataSource: Array<SudokuUnitData[]>;
  errorIdxs: string[];
}

interface SudokuUnitData {
  value: number;
  editable: boolean;
}

export default SudokuView;
