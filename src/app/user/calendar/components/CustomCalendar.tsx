import React, { useState } from "react";
import type { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Col, Select, Radio, Typography, Row } from "antd";
import dayjs from "dayjs";

const getListData = (value: Dayjs) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event......" },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const CustomCalender: React.FC = () => {
  const [value, setValue] = useState(() => dayjs("2023-08-25"));
  const [selectedValue, setSelectedValue] = useState(() => dayjs("2017-08-25"));

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <Calendar
      cellRender={cellRender}
      value={value}
      onSelect={onSelect}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        let current = value.clone();
        const localeData = (value as any).localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
          current = current.month(i);
          months.push(localeData.monthsShort(current));
        }

        for (let i = start; i < end; i++) {
          monthOptions.push(
            <Select.Option key={i} value={i} className="month-item">
              {months[i]}
            </Select.Option>
          );
        }

        const year = value.year();
        const month = value.month();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
          options.push(
            <Select.Option key={i} value={i} className="year-item">
              {i}
            </Select.Option>
          );
        }
        return (
          <div
            style={{
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1 className="text-xl font-semibold">
              {selectedValue?.format("MMMM D, YYYY")}
            </h1>
            <Row gutter={8}>
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  className="my-year-select"
                  value={year}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                >
                  {options}
                </Select>
              </Col>
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  value={month}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
            </Row>
          </div>
        );
      }}
    />
  );
};

export default CustomCalender;
