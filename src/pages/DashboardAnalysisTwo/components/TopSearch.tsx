import { Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { SearchDataType, VisitDataType } from '../data.d';

import { MiniArea } from './Charts';
import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';

const objects = [
  {
    index: 1,
    name: 'Amine Hamdene',
    term: '5 Days',
    amount: '3000 TND',
  },
  {
    index: 2,
    name: 'Samir Lousif',
    term: '10 Days',
    amount: '1250 TND',
  },
  {
    index: 3,
    name: 'Mounira Slimene',
    term: '11 Days',
    amount: '950 TND',
  },
  {
    index: 4,
    name: 'Ahlem Jendoubi',
    term: '29 Days',
    amount: '700 TND',
  },
  {
    index: 5,
    name: 'Emir Hamden',
    term: '20 Days',
    amount: '250 TND',
  },
];

const columns = [
  {
    title: '',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Client Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: React.ReactNode) => <a href="/">{text}</a>,
  },
  {
    title: <FormattedMessage id="dashboardanalysistwo.table.users" defaultMessage="Users" />,
    dataIndex: 'term',
    key: 'term',
    sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: <FormattedMessage id="dashboardanalysistwo.table.weekly-range" defaultMessage="Weekly Range" />,
    dataIndex: 'amount',
    key: 'amount',
    sorter: (a: { range: number }, b: { range: number }) => a.range - b.range,
    render: (text: React.ReactNode, record: { status: number }) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span style={{ marginRight: 4 }}>{text}%</span>
      </Trend>
    ),
  },
];

const TopSearch = ({
  loading,
  visitData2,
  searchData,
  dropdownGroup,
}: {
  loading: boolean;
  visitData2: VisitDataType[];
  dropdownGroup: React.ReactNode;
  searchData: SearchDataType[];
}) => (
  <Card
    loading={loading}
    bordered={false}
    title={
      <FormattedMessage
        id="dashboardanalysistwo.analysis.online-top-search"
        defaultMessage="Online Top Search"
      />
    }
    extra={dropdownGroup}
    style={{
      height: '100%',
    }}
  >
    <Row gutter={68} type="flex">
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              <FormattedMessage
                id="dashboardanalysistwo.analysis.search-users"
                defaultMessage="search users"
              />
            </span>
          }
          gap={8}
          total={numeral(12321).format('0,0')}
          status="up"
          subTotal={17.1}
        />
        <MiniArea line height={45} data={visitData2} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
      </Col>
    </Row>
    <Table<any>
      rowKey={record => record.index}
      size="small"
      columns={columns}
      dataSource={objects}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 5,
      }}
    />
  </Card>
);

export default TopSearch;
