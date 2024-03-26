import React, {useEffect,useState,useCallback,useMemo, useRef} from "react";
import { Button, Typography, Spin, Row, Col, Form } from "antd";
import AuthorisedContainer from "components/AuthorisedContainer";
import _ from "lodash";
import { PermissionSetMap } from "constants/RBACConstants";
import { FieldTypes, generateFormFields } from 'utils/formUtils';
import message from "components/CustomMessage";
import GlobalSettingAPI from "restAPI/GlobalSettingAPI";
import Vocabulary from "components/Vocabulary";
import { isSuperOrTenantAdmin } from "utils/authService";
import TableContainer from "components/TableContainer";

  

export default function AccountDetails() {
    const [submitBtn, setSubmitBtn] = useState(false);
    const ref = useRef('POST');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [canEdit] = useState(() => isSuperOrTenantAdmin());

    useEffect(() => {
        setLoading(true);
        const { promise, cancel } = GlobalSettingAPI.getAccountDetails();
        Promise.all([promise]).then(([res]) => {
        if(!_.isEmpty(res)) ref.current = 'PUT';
          form.setFieldsValue(res);
        }).finally(() => setLoading(false));
        return () => {
          cancel && cancel();
        };
      }, [form])
    
    const submit = useCallback((data) => {
        setSubmitBtn(true);   
        const messageReference = message.loading("Updating...");
        
        const { promise, cancel } = ref.current === "PUT" ? GlobalSettingAPI.updateAccountDetails(data) :  GlobalSettingAPI.createAccountDetails(data);
    
        promise
            .then(() => {
            ref.current='PUT';
            messageReference();
            message.success("Account details updated successfully");
          })
          .finally(e => {
            messageReference();
              setSubmitBtn(false);             
          });
    
        return cancel;
    }, []);
    
    const fields = useMemo(() => (
        [
            {
                name: "productCount",
                label: <>Total Number of <Vocabulary name="product" isPlural/></>,
                colSpan: 12,
                type: FieldTypes.NUMBER,
                disabled: !canEdit,
                props: {
                    suffix: <><Vocabulary name="product" isPlural/></>,
                }
            },
            {
                name: "developerCount",
                label: "Total Number of Developers",
                colSpan: 12,
                type: FieldTypes.NUMBER,
                disabled: !canEdit,
                props: {
                    suffix: "Developers",
                },
            },
            {
                name: "securityToolCount",
                label: "Total Number of Security Tools",
                colSpan: 12,
                type: FieldTypes.NUMBER,
                disabled: !canEdit,
                props: {
                    suffix: "Security Tools",
                }
            },
            {
                name: "securityEngineerCount",
                label: "Total Number of Security Engineers",
                colSpan: 12,
                type: FieldTypes.NUMBER,
                disabled: !canEdit,
                props: {
                    suffix: "Security Engineers",
                },
            }
        ]
    ), [canEdit]);
  
    return <>
        <Typography.Title level={5}>Account Details</Typography.Title>
        <Typography.Text>Enter account details to track and manage your AppSec program with ArmorCode. </Typography.Text>
        <div className='m-b-m'>
        <Spin spinning={loading}>
        <Form
          className="m-t-l"
          layout="vertical"
          form={form}
          onFinish={submit}
        >
       
          <Row>
            <Col span={18}>
            {generateFormFields(fields)}
            </Col>
            <Col span={18}>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <AuthorisedContainer permission={PermissionSetMap.UPDATE_GLOBAL_SETTING}>
                  <Button loading={submitBtn} className='pull-right' type="primary" htmlType="submit">
                    Save
                  </Button>
                </AuthorisedContainer>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <ToolTable/>
      </Spin>
    </div>
    </>
}


const ToolTable = () => {

  const [dummyData, setDummyData] = useState([
    {
      id: 1,
      category: "Threat Model",
    },
    {
      id: 2,
      category: "SAST",
      tool: "",
      toolStatus: "",
      deploymentPhase: "",
      subscription: "",
      contractRenewalDate: "",
    },
    {
      id: 3,
      category: "Secrets",
      tool: "",
      toolStatus: "",
      deploymentPhase: "",
      subscription: "",
      contractRenewalDate: "",
    },
    {
      id: 4,
      category: "SCA",
    },
    {
      id: 5,
      category: "DAST",
    },
    {
      id: 6,
      category: "IAST",
    },
    {
      id: 7,
      category: "MAST",
    },
    {
      id: 8,
      category: "Pen Testing",
    },
    {
      id: 9,
      category: "API Security",
    },
    {
      id: 10,
      category: "IaC",
    },
    {
      id: 11,
      category: "Container Security",
    },
    {
      id: 12,
      category: "Infrastructure Tools",
    },
    {
      id: 13,
      category: "CSPM",
    },
    {
      id: 14,
      category: "Repository",
    },
    {
      id: 15,
      category: "Ticketing",
    },
    {
      id: 16,
      category: "Messaging",
    },
    {
      id: 17,
      category: "CI/CD",
    },
    {
      id: 18,
      category: "Asset Management",
    },
    {
      id: 19,
      category: "Endpoint Vulnerability Management",
    },
  ]);

  const columns = [
    {
      width: 150,
      title: "Category",
      dataIndex: "category",
      key: "category",
      showSort: true,
      alwaysDisplay: true,
      render: CellRenderers.VALUE_OR_NA,
    },
    {
      width: 80,
      title: "Tool",
      dataIndex: "tool",
      key: "tool",
      showSort: true,
      alwaysDisplay: true,
      render: CellRenderers.VALUE_OR_NA,
    },
    {
      title: "Tool Status",
      dataIndex: "status",
      width: 150,
      filterIndex: 6,
      render: (status, record) => <DisplayToolStatus record={record} />
      // statusCallBack={(e, clickedStatus) => {
      //     setFilters((prevFilters) => {
      //         const { status = [], name = [], ...restFilters } = prevFilters;
      //         return {
      //             ...restFilters,
      //             name: _.uniq([...name, record.name]),
      //             status: _.uniq([...status, STATUS_FILTER_MAPPING[clickedStatus]]),
      //         };
      //     });
      //     if (subProductCountData.current[record.id] && subProductCountData.current[record.id].length < 100) {
      //         setExpandedValues([record.id]);
      //     }
      // }} 
      // />,
      //nullFilterValue: null,
      // ENG-32917 - No property related to filters should be passed if we don't want to enable filter for a column
      // ...getFilterProps({ filters: SSDLC_STATUS_FILTERS }), onFilter:  ssdlcToolStatusOnFilter,
  },
    {
      width: 100,
      title: "Deployment Phase",
      dataIndex: "deploymentPhase",
      key: "deploymentPhase",
      default: true,
      optional: true,
      render: CellRenderers.VALUE_OR_NA,
    },
    {
      title: "Contract Duration",
      dataIndex: "duration",
      key: "duration",
      optional: true,
      width: 80,
      default: true,
      render: (text, record) => {
        const dataType = typeof text;
          return (
            <>
            {(dataType === 'undefined' || text ===  "" )? 'N/A' : `${text} Years`}
            </>
          );
        },
    },
    {
      title: "Subscription",
      width: 80,
      dataIndex: "subscription",
      key: "subscription",
      optional: true,
      default: true,
      render: CellRenderers.VALUE_OR_NA,
    },
    {
      width: 80,
      title: "Contract Amount",
      dataIndex: "amount",
      key: "amount",
      optional: true,
      default: true,
      render: (text, record) => {
        const dataType = typeof text;
          return (
            <>
            {(dataType === 'undefined' || text ===  "" )? 'N/A' : `$${Number(text).toLocaleString()}`}
            </>
          );
        },
      
    },
    {
      width: 100,
      title: "Contract Renewal Date",
      dataIndex: "contractRenewalDate",
      key: "contractRenewalDate",
      optional: true,
      default: true,
      render: CellRenderers.DATE,
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (text, record) => {
        // Creating a new Menu for actions button.
        return (
          <>
            <Row gutter={16}>
              <Button
                type="text"
                onClick={(type, data) => handleEditTool(record)}
                icon={<EditIcon />}
              />
              <Button
                danger
                type="text"
                onClick={(type, data) => handleDelete(record.id)}
                icon={<DeleteIcon />}
              />
            </Row>
          </>
        );
      },
      default: true,
    },
  ];

  const handleEditTool = (record) => {
    console.log(record.category);
    ModalUtil.show({
      content: (
        <>
         <AddToolModal recordData={record} dummyData={dummyData} setDummyData={setDummyData} modalType="edit"/>
        </>
      ),
    });
  };

  const handleDelete = (id) => {
    console.log(id);
    ModalUtil.show({
      content: (
        <DeletePopup
          confirmText={"Delete"}
          onDelete={() =>
            setDummyData((prevData) =>
              prevData.filter((item) => item.id !== id)
            )
          }
        />
      ),
    });
  };

  const handleAddTool = () => {
    ModalUtil.show({
      content: (
        <>
         <AddToolModal dummyData={dummyData} setDummyData={setDummyData} modalType="add"/>
        </>
      ),
    });
  };

  return (
    <>
    <div style={{padding: '0 300px 0 0' }}>
    <TableContainer
        dataSource={dummyData}
        columns={columns}
        locale={{ emptyText: <>No Details Found</> }}
        />
      <Button className="pull-right" type="primary" onClick={handleAddTool}>
        Add
      </Button>
        </div>
    </>
  )
}
