import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { QueueResponse } from '../domain/Response';
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import { QueueRequestForWeb } from "../domain/Request";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from "@mui/material/Typography/Typography";

const times: string[] = ["10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00", "18.00", "19.00"];

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function TableAdmin() {

  const [queues, setQueues] = useState<QueueResponse[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [tabledata, setTableData] = useState<QueueResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // update state
  const [status, setStatus] = useState<string>('');
  const [queueUpdate, setQueueUpdate] = useState<QueueResponse>();

  const [open, setOpen] = React.useState(false);

  const [isDayOff, setIsDayOff] = useState<string>('');

  const handleClickOpen = (data: QueueResponse) => {
    setOpen(true);
    setStatus(data.statusId);
    setQueueUpdate(data);
  };

  const handleClose = (data: QueueResponse) => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log(queueUpdate);
    console.log(status);
    setOpen(false);
    updateQueue({
      queueId: String(queueUpdate?.queueId),
      statusId: String(status),
      isQueueExist: queueUpdate?.queueDate === '' ? 'false' : 'true'
    });
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
    setIsDayOff(daysOfWeek[date.getDay()]);
  };

  const onChangeDate = (dateChange: any) => {
    setDate(dayjs(dateChange).toDate());
  }

  async function fetchQueue(): Promise<QueueResponse[]> {
    setIsLoading(true);

    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear();

    if (day.length == 1) {
      day = 0 + day;
    }
    if (month.length == 1) {
      month = 0 + month;
    }

    let finalDate = year + '-' + month + '-' + day

    console.log(finalDate);

    const response = await fetch('https://qms-api-77ejhpt2zq-as.a.run.app/qms/api/queue/queueListForWeb', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-API-KEY': 'adminqmsapikey',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With'
      },
      body: JSON.stringify({
        shopId: 'S001',
        queueDate: finalDate,
      }),
    });
    const data = await response.json();
    createTableQueue(data);
    return data;
  }

  async function updateQueue(request: QueueRequestForWeb): Promise<QueueResponse[]> {
    console.log(request);
    setIsLoading(true);
    const response = await fetch('https://qms-api-77ejhpt2zq-as.a.run.app/qms/api/queue/queueUpdateStatusForWeb', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-API-KEY': 'adminqmsapikey',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With'
      },
      body: JSON.stringify({
        queueId: request.queueId,
        statusId: request.statusId,
        isQueueExist: request.isQueueExist,
      }),
    });
    const data = await response.json();
    createTableQueue(data);
    fetchQueue().then((data) => setQueues(data));
    setIsLoading(false);
    return data;
  }

  useEffect(() => {
    fetchQueue().then((data) => setQueues(data));
    setIsDayOff(daysOfWeek[date.getDay()]);
  }, [date]);

  const createTableQueue = (data: QueueResponse[]) => {

    let queueProsess: QueueResponse[] = [];

    for (let index = 0; index < times.length; index++) {
      queueProsess.push({
        queueId: times[index].replace('.', '') + ('0' + date.getDate()).slice(-2) + ('0' + (date.getMonth() + 1)).slice(-2) + date.getFullYear().toString(),
        queueDate: "",
        queueTime: times[index],
        queuePrice: "",
        queueTimeout: "",
        employeeId: "",
        employeeName: "",
        serviceId: "",
        statusId: "00",
        shopId: "S001"
      });
    };

    for (let i = 0; i < data.length; i++) {
      for (let y = 0; y < queueProsess.length; y++) {
        if (data[i].queueTime === queueProsess[y].queueTime) {
          queueProsess[y] = data[i];
        }
      }
    };

    setTableData(queueProsess);
    setIsLoading(false);
  }

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box m={5}>
          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label="เลือกวันที่"
              format="DD/MM/YYYY"
              value={dayjs(date)}
              onChange={(newValue) => onChangeDate(newValue)}
            />
          </DemoContainer>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">เวลา</TableCell>
                <TableCell align="center">ช่างเต๋อ</TableCell>
                <TableCell align="center">แก้ไข</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableBody>
                <Box m={2} pl={19}>
                  <CircularProgress />
                </Box>
              </TableBody>
            ) : (isDayOff === 'Wednesday' ? (
              <TableBody>
                <Box m={2} pl={15}>
                  <Typography variant="h6" gutterBottom>
                    Closed Every Wednesday
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    (ร้านปิดทุกวันพุธ)
                  </Typography>
                </Box>
              </TableBody>
            ) : (
              <TableBody>
                {tabledata.map((row) => (
                  <TableRow
                    key={row.queueId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.queueTime}
                    </TableCell>
                    {row.statusId === '01' ? (
                      <TableCell align="center" ><Chip label={'ไม่ว่าง'} color="error" /></TableCell>
                    ) : (
                      <TableCell align="center" ><Chip label={'ว่าง'} color="success" /></TableCell>
                    )}
                    <TableCell align="center" component="th" scope="row">
                      <Button size="small" variant="outlined" endIcon={<CreateIcon />} onClick={() => handleClickOpen(row)}>
                        แก้ไข
                      </Button>
                      <Dialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                      >
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                          Edit Queue
                        </DialogTitle>
                        <IconButton
                          aria-label="close"
                          onClick={() => handleClose(row)}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <DialogContent dividers>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Status</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Status"
                                onChange={handleChangeStatus}
                              >
                                <MenuItem value={'00'}>ว่าง</MenuItem>
                                <MenuItem value={'01'}>ไม่ว่าง</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={() => handleSave()}>
                            Save
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </LocalizationProvider>
    </React.Fragment>
  );
}