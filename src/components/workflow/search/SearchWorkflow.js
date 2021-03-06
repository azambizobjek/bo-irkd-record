import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// import Breadcrumb from '../../../layouts/Breadcrumb'
import { setActivePage } from '../../../actions/layoutInitAction'
import { setCardView, setSelWorkFlow, setShowFab, getDetails, setWorkflowName } from '../../../actions/workflowAction'
import { setRecordStore, setListActivity } from '../../../actions/workflowAction'
// import { setNewBread } from '../../../../actions/breadcrumbAction'

// import Fab from '../../../fab/FabWorkflow'
import Search from '../search/ModalWorkflow'
import CardView from '../CardView'
import ListView from '../ListView'

import Tooltip from 'rc-tooltip'
import update from 'immutability-helper'

import 'rc-tooltip/assets/bootstrap.css'


class SearchWorkflow extends Component {

    constructor() {
        super()
        this.state = {
            workList: [],

        }

    }

    componentDidUpdate(prevProps) {
        if (prevProps.workflow.listWorkflow !== this.props.workflow.listWorkflow) {
            const { listWorkflow } = this.props.workflow
            // console.log(listWorkflow)
            const listWkflw = listWorkflow.map(res => ({ ...res, isSel: false }))
            //  console.log(listWkflw)
            this.setState({
                workList: listWkflw
            })
        }
    }

    //Direct Page To WorkFlow Detail
    setActivePage = (FabRec) => {

        const { user: { _id: bId } } = this.props.session
        const { wrkflSel, workflowTemplate, workflowName } = this.props.workflow

        // this.props.setPageSubject(workflowTemplate)
        this.props.setShowFab(false)
        this.props.setActivePage(FabRec)

        //Activity Wizard
        const workflowDet = {
            _action: 'SEARCHACTIVITY',
            workflowUri: wrkflSel,
            _id: bId,
        }

        this.props.setListActivity(workflowDet)

        //Record Wizard    
        const recordDet = {
            _id: bId,
            _action: "SEARCHRECORD",
            jsonQuery: JSON.stringify([{ "op": "EQUALS", "field": "%26%26Related+Records+of+Workflow", "value1": workflowName }]),
            searchOrder: "0"
        }
        // console.log(recordDet)
        this.props.setRecordStore(recordDet)
       
        //Breadcrumb
        this.props.setNewBread(false, {
            id: wrkflSel,
            label: workflowName,
            activePage: 'viewWorkflow',
            isActive: true,
        })
    }


    //Selection
    markOnSel = (workflowName, markOnSel, workflowUri, isSel, supervisor, icon, dateStart, dateDue, jobNo, priority) => {

        const { user: { _id: bId } } = this.props.session
        const val = [{ workflowName, markOnSel, workflowUri, isSel, supervisor, icon, dateStart, dateDue, jobNo, priority }]

        this.props.getDetails(val) //Set Workflow Details
        this.props.setSelWorkFlow(workflowUri)  //Set Workflow Uri
        this.props.setWorkflowName(workflowName)  //Set Workflow Name   

        const { workList } = this.state
        // console.log({workList} )
        const itmIdx = workList.findIndex(itm => itm.workflowUri === workflowUri)
        const desIdx = workList.findIndex(itm => itm.isSel === true)

        const newWrkfwList = desIdx === -1 ?
            update(workList, {
                [itmIdx]: { isSel: { $set: true } }
            })
            : update(workList, {
                [itmIdx]: { isSel: { $set: true } },
                [desIdx]: { isSel: { $set: false } }
            })
        // // select
        if (itmIdx === desIdx) {
            this.props.setShowFab(false)
            this.props.setSelWorkFlow(null)


        }
        else {
            this.props.setShowFab(true)
        }

        this.setState({
            workList: newWrkfwList

        })
    }

    //Change view Card and List
    changeToViewCard = (e) => {
        const { cardView } = this.props.workflow
        this.props.setCardView(!cardView)
    }





    render() {

        const { cardView, showFab } = this.props.workflow

        const { workList } = this.state
        // console.log(workList)

        const rec = workList.map(itm => cardView ?
            <ListView
                key={itm.workflowUri}
                workflowName={itm.workflowName}
                workflowUri={itm.workflowUri}
                markOnSel={this.markOnSel}
                isSel={itm.isSel}
                dateStart={itm.dateStarted}
                dateDue={itm.dateDue}
                jobNo={itm.jobNumber}
                priority={itm.priority}
            />
            :
            <CardView
                key={itm.workflowUri}
                workflowName={itm.workflowName}
                workflowUri={itm.workflowUri}
                icon={itm.iconCls}
                markOnSel={this.markOnSel}
                isSel={itm.isSel}
                supervisor={itm.supervisor}
                dateStart={itm.dateStarted}
                dateDue={itm.dateDue}
                jobNo={itm.jobNumber}
                priority={itm.priority}
            />

        )


        return (
            <Fragment>

            {/* <div className="breadcrumb-holder">
                <div className="container-fluid">
                    <Breadcrumb/>
                </div>
            </div>  */}

                <section className="forms">
                    <div className="container-fluid">
                        <header>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h1 className="h3 display"><strong>Search Workflow</strong></h1>

                                <div className="d-flex align-items-center">

                                    {/* <Tooltip
                                        placement="top"
                                        overlay={<div style={{ height: 20, width: '100%' }}>Create new activity</div>}
                                        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                                    >
                                        <button className="btn btn-sm btn-primary" onClick={this.createNewActivity} name="createNewAct" data-name="Create New" data-pagename="createNewAct">
                                            <i className="fa fa-tasks" name="createNewAct" data-name="Create New" data-pagename="createNewAct"></i>
                                        </button>
                                    </Tooltip> */}

                                    <Tooltip
                                        placement="top"
                                        overlay={<div style={{ height: 20, width: '100%' }}>Change to Card</div>}
                                        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                                    >
                                        <button className="btn btn-sm btn-primary ml-2" onClick={this.changeToViewCard}>
                                            <i className="fa fa-th" aria-hidden="true"></i>
                                        </button>
                                    </Tooltip>


                                    {/* <Tooltip
                                        placement="top"
                                        overlay={<div style={{ height: 20, width: '100%' }}>Sort by latest creation</div>}
                                        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                                    >
                                        <button className="btn btn-sm btn-primary ml-2" alt="Sort" onClick={this.sortItem}>
                                            <i className="fa fa-sort-amount-asc" aria-hidden="true"></i>

                                        </button>

                                    </Tooltip> */}
                                </div>

                            </div>

                            <Search />

                        </header>

                        <div className="row">
                            {cardView !== false ? 
                                workList.length!==0?
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="p-2 img-fluid img-scale" />
                                                <div className="col p-2">
                                                    <p className="card-title mb-1 font-weight-bold text-muted">Title</p>
                                                </div>
                                                <div className="col p-2">
                                                    <p className="card-title mb-1 font-weight-bold text-muted">Workflow</p>
                                                </div>
                                                 
                                                <div className="col p-2">
                                                    <p className="card-title mb-1 font-weight-bold text-muted">Due Date</p>
                                                </div>
                                            </div>
                                        </div>{rec}
                                    </div>
                                :"" 
                            : rec}
                        </div>
                        



                        {/* {showFab ? <Fab
                            FabRec={this.setActivePage}
                            delBtn={this.delBtn}
                        /> : ''} */}

                    </div>
                </section>
            </Fragment>
        )
    }
}

SearchWorkflow.propTypes = {
    session: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    setCardView: PropTypes.func.isRequired,
    getDetails: PropTypes.func.isRequired,
    setSelWorkFlow: PropTypes.func.isRequired,
    setWorkflowName: PropTypes.func.isRequired,
    setShowFab: PropTypes.func.isRequired,
    setActivePage: PropTypes.func.isRequired,
    setRecordStore: PropTypes.func.isRequired,
    setListActivity: PropTypes.func.isRequired,
    // setNewBread: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    session: state.session,
    workflow: state.workflow,

})
export default connect(mapStateToProps,
    {
        setActivePage,
        setCardView,
        setSelWorkFlow,
        setShowFab,
        setListActivity,
        getDetails,
        // setNewBread,
        setRecordStore,
        // setPageTitle,
        setWorkflowName

    })(SearchWorkflow)

