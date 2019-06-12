
function loadManual(fileName) {
	var data;

	test3t = '#execute,#description,#service_name,#reference,#timeout,#action,#message_type,#check_point,TargetCompID,TradeReportID,TradeReportTransType,TradeReportType,TrdRptStatus,TradeID,TradeHandlingInstr,TradeReportRejectReason,MatchType,MatchStatus,TrdType,TrdSubType,CurrentMarketPriceValueIndicator,NegotiatedTradeIndicator,ExceededTheMinimumSizeIndicator,RequestNotToPublishQuantityIndicator,VenueIdentificationCode,OriginalPrice,SettlCurrency,LastQty,LastPx,GrossTradeAmt,SettlDate,TradePublishIndicator,NovatedIndicator,NoSides,TCRSideGroupBIT,FirmTradeID,TradeReportRefID,ClOrdID,OrigClOrdID,ExecType,OrdStatus,ExpireTime,ClearingType,ExpireDate,AppID,MassCancelRequestType,MassCancelResponse,MarketSegmentID,SecondaryClOrdID,ClOrdLinkID,TransactTime,Side,OrdType,TimeInForce,OrderQty,Price,DisplayQty,MinQty,CumQty,MassActionReportID,TotalAffectedOrders,PriceType,OrderID,OrderCategory,ExecInst,OrigTradeHandlingInstr,ProductComplex,ApplResendFlag,SecurityType,SecurityIDSource,DelayMode,IntendedPublishTime,SecAltIDGrp,NoSecurityAltID,SecurityAltID,SecurityAltIDSource,SecurityID,AccountType,OrderCapacity,RoutingInst,TradingParty,TargetParty,NoPartyIDs,PartyID,PartyIDSource,PartyRole,NoTargetPartyIDs,TargetPartyID,TargetPartyIDSource,TargetPartyRole,ExecRestatementReason,ApplVerID,Account,Text\r\n';
	test3 = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test3 += ',Invalid contra side role,,TC1,,test case start,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test3 += 'y,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test3 += 'y,,,group_NoPartyIDs_2,,,NoPartyIDs,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,OFB_PT3,D,76,,,,,,,,\r\n';
	test3 += 'y,,,group_NoPartyIDs_3,,,NoPartyIDs,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,PostTrade,D,1,,,,,,,,\r\n';
	test3 += 'y,,,group_NoPartyIDs_4,,,NoPartyIDs,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,OFB_PT2,D,76,,,,,,,,\r\n';
	test3 += 'y,,,group_NoPartyIDs_1,,,NoPartyIDs,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,PostTrade,D,17,,,,,,,,\r\n';
	test3 += 'y,,,component_TradingParty1,,,TradingParty,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"[group_NoPartyIDs_2,group_NoPartyIDs_3]",,,,,,,,,,,\r\n';
	test3 += 'y,,,component_TradingParty2,,,TradingParty,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"[group_NoPartyIDs_4,group_NoPartyIDs_1]",,,,,,,,,,,\r\n';
	test3 += 'y,,,group_NoSides2,,,NoSides,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SELL,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[component_TradingParty2],,,,,,,,,,,,,\r\n';
	test3 += 'y,,,group_NoSides1,,,NoSides,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,BUY,,,,,,,,,,,,,,,,,,,,,,,,,,3,P,,[component_TradingParty1],,,,,,,,,,,,,\r\n';
	test3 += 'y,,,component_TrdCapRptSideGrp,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"[group_NoSides1,group_NoSides2]",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test3 += 'y,Get checkpoint,OFB_PT1,check1,,GetCheckPoint,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test3 += 'y, ,OFB_PT1,ob1,,FIX_SendTradeCaptureReport,quickfix.fix50.TradeCaptureReport,,,,0,0,,,1,,,,OFF_BOOK_TRADE,,,,,,,,,2000,23,,20121027,1,,2,[component_TrdCapRptSideGrp],Olya,,,,,,,,,,,,,,,"#{TransactTime(""Y+0:m+0:D+0:h=11:M=10:s=11"")}",,,,,,,,,,,,,,,,,,,8,,,,,,,6781761,,,,,,,,,,,,,,,,,\r\n';
	test3 += 'y,Ack,OFB_PT1,ack1,5000,FIX_WaitTradeCaptureReportAck,quickfix.fix50.TradeCaptureReportAck,check1,,,${ob1:TradeReportTransType},${ob1:TradeReportType},REJECTED,,1,7014,,1,54,,,,,,,,,${ob1:LastQty},${ob1:LastPx},,,${ob1:TradePublishIndicator},,${ob1:NoSides},,${ob1:FirmTradeID},,,,,,,,,,,,,,,${ob1:TransactTime},,,,,,,,,,,,,,,,,,,8,,,,,,,6781761,,,,,,,,,,,,,,,,,\r\n';
	test3 += ',,,,,test case end,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';

	var test2t = '#id,#execute,#description,#add_to_report,#service_name,#reference,#reference_to_filter,#timeout,#action,#message_type,#check_point,TradeUnitSize,TickSize,#double_precision,#system_precision,ClOrdID,OrigClOrdID,SecurityStatusReqID,MDReqID,SubscriptionRequestType,MarketDepth,MDUpdateType,AggregatedBook,MDReqGrp,InstrmtGrp,MDUpdateAction,SecurityTradingStatus,UnsolicitedIndicator,MDEntryType,NoMDEntryTypes,NoRelatedSym,MDEntryPx,MDEntrySize,ExecType,OrdStatus,Text,SecondaryOrderID,ClOrdLinkID,TransactTime,ExpireTime,Side,Symbol,OrdType,PriceType,TimeInForce,OrderQty,Price,LastQty,LastPx,MinQty,CumQty,LeavesQty,AvgPx,OrderID,ExecInst,SecurityIDSource,SecurityExchange,SecurityID,Currency,AccountType,OrderCapacity,RoutingInst,TradingParty,TargetParty,NoPartyIDs,PartyID,PartyIDSource,PartyRole,OrdStatusReqID,MassActionType,MassActionScope,MassStatusReqID,MassStatusReqType,MaxShow,GrossTradeAmt,CxlRejReason,CxlRejResponseTo,MassActionResponse,MassActionReportID,OrdRejReason,MultiLegReportingType,LegSecurityID,LegSecurityIDSource,LegSide,LegPrice,LegOrderQty,LegRefID,LegYield,LegAllInRate,NoLegs,InstrmtLegExecGrp,WaitingTags,MsgType,NoMDEntries,MDEntryTime,QuoteCondition,TradeCondition,MDEntryID,MDEntryPositionNo,TradingSessionID,NumberOfOrders,MDPriceLevel,RefreshIndicator,MDIncGrp,MDFullGrp,Trade_Size,Trade_Price,ExecID,TotalAffectedOrders,NoNested3PartyIDs,Nested3PartyID,Nested3PartyIDSource,Nested3PartyRole,AggressorIndicator,NestedParties3,Host,Port,CurveServName,CurvInstrName,BID,ASK,OLD_BID,OLD_ASK,#static_type,#static_value\r\n';
	test2 = '777,y,Action for Update SF decomposition functions,y,,def_eur_3M_out1,,,DataCurveUpdate,HashMap,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,EURv3MEURIB:20Y,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,${eur_3M_out1:BID},${eur_3M_out1:ASK},,,,\r\n';
	test2 += '888,y,default bid value,,,def_eur_3M_out1_bid,,,SetStatic,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,String,${def_eur_3M_out1:OLD_BID}\r\n';
	test2 += '888,y,default ask value,,,def_eur_3M_out1_ask,,,SetStatic,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,String,${def_eur_6M_out1:OLD_ASK}\r\n';
	test2 += '777,y,Action for Update SF decomposition functions,y,,def_eur_3M_out2,,,DataCurveUpdate,HashMap,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,EURv3MEURIB:25Y,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,${eur_3M_out2:BID},${eur_3M_out2:ASK},,,,\r\n';
	test2 += '888,y,default bid value,,,def_eur_3M_out2_bid,,,SetStatic,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,String,${def_eur_3M_out2:OLD_BID}\r\n';
	test2 += '888,y,default ask value,,,def_eur_3M_out2_ask,,,SetStatic,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,String,${def_eur_3M_out2:OLD_ASK}\r\n';
	test2 += '777,y,Action for Update SF decomposition functions,y,,def_eur_3M_out3,,,DataCurveUpdate,HashMap,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,EURv3MEURIB:30Y,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,${eur_3M_out3:BID},${eur_3M_out3:ASK},,,,\r\n';
	test2 += '888,y,default bid value,,,def_eur_3M_out3_bid,,,SetStatic,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,String,${def_eur_3M_out3:OLD_BID}\r\n';
	test2 += '888,y,default ask value,,,def_eur_3M_out3_ask,,,SetStatic,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,String,${def_eur_3M_out3:OLD_ASK}\r\n';

	var test1t = '#id,#messages_count,#execute,#description,#add_to_report,#service_name,#reference,#timeout,#action,#message_type,#check_point,#double_precision,CurrentGross,ClOrdID,OrigClOrdID,TraderID,SequenceNo,Account,OrderID,Side,InstrumentID,SecurityID,OrderQty,OrdQty,ExecutedQty,CumQty,LeavesQty,DisplayQty,SecurityIDSource,StopPx,Price,LimitPrice,ExecutedPrice,StoppedPrice,TIF,TimeInForce,OrdType,OrderType,TransactTime,OrderSubType,ExpireDateTime,ExecInstruction,AutoCancel,OrderCapacity,AccountType,ClearingAccount,Capacity,ExecType,OrdStatus,AppID,Anonymity,BrokerId,BidPrice,BidSize,AskPrice,AskSize,UserId,AgressorIndicator,PreTradeAnonymity,HandlInst,Text,RejectCode,OrderRejectCode,Container,TradeMatchID,TradeLiquidityIndicator,MassCancelType,Segment,MassCancelResponse,RejectReason,CancelRejReason,cmd,FOSMarketId,LocalCodeStr,Description,CFICode,L1Bid,L1Ask,L1Trade,L1Content,L1MiscValues,L2Bids,MESQualifier,L2Asks,PolymorphicInstrumentCodeList,OnBehalfOfCompID\r\n';
	test1 = ',,,,,,,,test case start,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '1,,y,send new valid quote,y,QMG_NAT1,a1,2000,NATBIT_SendNewQuote,NewQuote,,,,#{ClOrdID()},,QMG_NAT1,,,,,1455422,,,,,,,,,,,,,,,Day,,,,,,,0,,,Client,3,,,,0,,100,10000,101,10000,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '0,,y,send_mass_cancel_orders,y,QMG_NAT1,mas0,2000,NATBIT_SendOrderMassCancelRequest,OrderMassCancelRequest,,,,#{ClOrdID()},,,,,,,,,,,,,,,,,,,,,,,,,,Order,,,,,,,,,,,,,,,,,,,,,,,,,,,8,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '0,,y,send_mass_cancel_quotes,y,QMG_NAT1,mas0_,2000,Sleep,,,,,,,,,,,\r\n';
	test1 += '2,,y,Execution report,y,QMG_NAT1,e1,2000,NATBIT_WaitExecutionReport,ExecutionReport,,,,${a1:ClOrdID},,,,,*,Buy,145541,,,,0,,10000,10000,,,,,,,,,,,,,,,,,,,,New,New,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '0,,y,send_mass_cancel_orders,y,QMG_NAT1,mas02,2000,NATBIT_SendOrderMassCancelRequest,OrderMassCancelRequest,,,,#{ClOrdID()},,,,,,,,,,,,,,,,,,,,,,,,,,Order,,,,,,,,,,,,,,,,,,,,,,,,,,,8,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '0,,y,send_mass_cancel_quotes,y,QMG_NAT1,mas02_,2000,NATBIT_SendOrderMassCancelRequest,OrderMassCancelRequest,,,,#{ClOrdID()},,,,,,,,,,,,,,,,,,,,,,,,,,Quote,,,,,,,,,,,,,,,,,,,,,,,,,,,8,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '0,,y,send_mass_cancel_quotes,y,QMG_NAT1,mas022_,2000,NATBIT_SendOrderMassCancelRequest,OrderMassCancelRequest,,,,#{ClOrdID()},,,,,,,,,,,,,,,,,,,,,,,,,,Quote,,,,,,,,,,,,,,,,,,,,,,,,,,,8,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '1,,y,send new valid quote,y,QMG_NAT1,a12,8000,Sleep,NewQuote,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '2,,y,Execution report,y,QMG_NAT1,e12,2000,NATBIT_WaitExecutionReport,ExecutionReport,,,,${a1:ClOrdID},,w,,,*,Buy,145541,,,,0,,10000,10000,,,,,,,,,,,,,,,,,,,,New,New,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += '0,,y,send_mass_cancel_orders,y,QMG_NAT1,mas03,2000,NATBIT_SendOrderMassCancelRequest,OrderMassCancelRequest,,,,#{ClOrdID()},,,,,,,,,,,,,,,,,,,,,,,,,,Order,,,,,,,,,,,,,,,,,,,,,,,,,,,8,,,,,,,,,,,,,,,,,,,\r\n';
	test1 += ',,,,,,,,test case end,,,,,,,,,,,,,,,,,,,,,,,,\r\n';

	var test4t = '#id,#continue_on_failed,#messages_count,#execute,#fail_unexpected,#description,#service_name,#reference,#timeout,#action,#message_type,#check_point,OnBehalfOfCompID,ApplVerID,ClOrdID,OrigClOrdID,OrderID,TradingParty,NoPartyIDs,PartyID,PartyIDSource,PartyRole,Account,SecurityID,SecurityIDSource,OrdType,TimeInForce,ExpireTime,ExpireDate,Side,OrderQty,DisplayQty,Price,AccountType,OrderCapacity,TransactTime,SecondaryClOrdID,ClOrdLinkID,ApplID,ExecInst,MassCancelRequestType,TargetParty,NoTargetPartyIDs,TargetPartyID,TargetPartyIDSource,TargetPartyRole,MarketSegmentID,ExecID,ExecType,TrdMatchID,ExecRefID,ExecRestatementReason,OrdStatus,WorkingIndicator,OrdRejReason,Text,LastQty,LastPx,ConvertedYield,Yield,LeavesQty,CumQty,TradeLiquidityIndicator,PreTradeAnonymity,AvgPx,MassActionReportID,MassCancelResponse,MassCancelRejectReason,DisplayMethod,OrderBook,StopPx,OrderSource,LastParPx,ParPx,QuoteMsgID,QuoteID,BidPx,BidSize,OfferPx,OfferSize,QuotQualGrp,NoQuoteQualifiers,QuoteQualifier,QuoteCancelType,QuotCxlEntriesGrp,NoQuoteEntries,QuoteStatus,QuoteRejectReason,TradeRequestID,TradeRequestType,MatchType,TrdType,SecAltIDGrp,NoSecurityAltID,SecurityAltID,SecurityAltIDSource,SecurityType,ProductComplex,TCRUnderlyingBIT,NoUnderlyings,UnderlyingSymbol,Issuer,ApplReqID,ApplReqType,ApplMesReqGrpBIT,NoApplIDs,RefApplID,ApplBegSeqNum,ApplEndSeqNum,ApplSeqNum,ApplLastSeqNum,ApplResendFlag,LastRptRequested,TradeReportID,TradeID,TradeLinkID,FirmTradeID,TradeReportRefID,TradeHandlingInstr,TradeReportType,ClearingType,NovatedIndicator,OriginalPrice,SettlCurrency,TradeReportTransType,MatchStatus,OrigTradeHandlingInstr,PriceType,SettlDate,MaturityDate,IssueDate,CurrentMarketPriceValueIndicator,NegotiatedTradeIndicator,ExcedeedTheMinimumSizeIndicator,RequestNotToPublish,DelayMode,IntendedPublishTime,VenueIdentificationCode,TCRSideGroupBIT,NoSides,SideExecID,TradingSessionSubID,OrderCategory,SideLiquidityInd,TradeRequestStatus,TradeRequestResult,TotNumTradeReports,ApplResponseID,RefApplLastSeqNum,ApplResponseError,TradePublishIndicator,TrdRptStatus,TradeReportRejectReason\r\n';
	var test4 = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,,,ETF. TS1. Order amendment/trade/cancellation (FIX),,TC1,,test case start,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,SecurityAltID_Instrument1,,,NoSecurityAltID,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,FR0010204081,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,SecurityAltID_1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[SecurityAltID_Instrument1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,QuoteEntry_Instrument1,,,NoQuoteEntries,,,,,,,,,,,,,362587,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,QuoteEntries_1,,,QuotCxlEntriesGrp,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[QuoteEntry_Instrument1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,PartyID_Trader1,,,NoPartyIDs,,,,,,,,,ETFQA_FIX1,PROPRIETARY_CUSTOM_CODE,TRADER_GROUP,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TradingParty_Trader1,,,TradingParty,,,,,,,,[PartyID_Trader1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,PartyID_counterparty,,,NoPartyIDs,,,,,,,,,CCEGITR0001,PROPRIETARY_CUSTOM_CODE,COUNTERPARTY,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,PartyID_ClearingOrg,,,NoPartyIDs,,,,,,,,,CCEGITR0002,PROPRIETARY_CUSTOM_CODE,24,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,PartyID_Firm,,,NoPartyIDs,,,,,,,,,QAEPETF,PROPRIETARY_CUSTOM_CODE,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TradingParty_Trader1_and_counterparty,,,TradingParty,,,,,,,,"[PartyID_Trader1,PartyID_counterparty]",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TradingParty_Trader2_and_counterparty,,,TradingParty,,,,,,,,"[PartyID_Trader2,PartyID_counterparty]",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TargetPartyID_Trader1,,,NoTargetPartyIDs,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,ETFQA_FIX1,PROPRIETARY_CUSTOM_CODE,TRADER_GROUP,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TargetParty_Trader1,,,TargetParty,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[TargetPartyID_Trader1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TargetPartyID_Firm1,,,NoTargetPartyIDs,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,QAEPETF,PROPRIETARY_CUSTOM_CODE,MEMBER_ID,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TargetParty_Firm1,,,TargetParty,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[TargetPartyID_Firm1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TradingParty_Trader1_in_TCR,,,TradingParty,,,,,,,,"[PartyID_Firm,PartyID_Trader1,PartyID_counterparty,PartyID_ClearingOrg]",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TradingParty_Trader2_in_TCR,,,TradingParty,,,,,,,,"[PartyID_Firm,PartyID_Trader1,PartyID_counterparty,PartyID_ClearingOrg]",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,BuySide_Trade1,,,NoSides,,,,${ord1:ClOrdID},,${exr1:OrderID},[TradingParty_Trader1_in_TCR],4,,,,Lit_Day_S1,,,,,,,SELL,,,,,P,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,${exr1a:ExecID},,ORDER,ADDED_LIQUIDITY,,,,,,,,,\r\n';
	test4 += ',,,y,,,,SellSide_Trade1,,,NoSides,,,,${amd1:ClOrdID},,${exr2:OrderID},[TradingParty_Trader2_in_TCR],4,,,,Lit_Day_B1,,,,,,,BUY,,,,,P,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,${exr2c:ExecID},,ORDER,REMOVED_LIQUIDITY,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TCR_BuySide_Trade1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[BuySide_Trade1],,,,,,,,,,,,,\r\n';
	test4 += ',,,y,,,,TCR_SellSide_Trade1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[SellSide_Trade1],,,,,,,,,,,,,\r\n';
	test4 += '1,,,y,,Get checkpoint,,check1,,GetCheckPoint,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '2,,,y,,Cancel all firm orders for an instrument,ETFQA_FIX1,mcreq1,,FIX_SendOrderMassCancelRequest,quickfix.fix50.OrderMassCancelRequest,,,,#{ClOrdID()},,,,,,,,,362587,8,,,,,,,,,,,new Date(),,,,,1,[TargetParty_Firm1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '3,,,y,,Cancel all firm quotes for an instrument,ETFQA_FIX1,qcan1,,FIX_SendQuoteCancel,quickfix.fix50.QuoteCancel,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[TargetParty_Firm1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,#{ClOrdID()},,,,,,,,,1,[QuoteEntries_1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '4,,,y,,"Sleep 0,5 sec",,,500,Sleep,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '5,,,y,,Get checkpoint,,check2,,GetCheckPoint,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '6,,,y,,Sell Day Limit Order 200@97.4 (order 1),ETFQA_FIX1,ord1,,FIX_SendNewOrderSingle,quickfix.fix50.NewOrderSingle,,,,#{ClOrdID()},,,[TradingParty_Trader1],,,,,Lit_Day_S1,362587,8,LIMIT,,,,SELL,200,200,97.4,HOUSE,P,new Date(),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '7,,,y,,ER for order 1 with Status=New,ETFQA_FIX1,exr1,2000,FIX_WaitExecutionReport,quickfix.fix50.ExecutionReport,check2,,,${ord1},,*,[TradingParty_Trader1],1,,,,${ord1},${ord1},${ord1},${ord1},,,,${ord1},${ord1},${ord1},${ord1},${ord1},${ord1},,,,*,,,,,,,,,*,NEW,,,,NEW,,,,,,,,${ord1:OrderQty},0,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '8,,,y,,Get checkpoint,,check3,,GetCheckPoint,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '9,,,y,,Buy Day Limit Order 100@97.2 (order 2),ETFQA_FIX1,ord2,,FIX_SendNewOrderSingle,quickfix.fix50.NewOrderSingle,,,,#{ClOrdID()},,,[TradingParty_Trader1],,,,,Lit_Day_B1,362587,8,LIMIT,,,,BUY,100,100,97.2,HOUSE,P,new Date(),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '10,,,y,,ER for order 2 with Status=New,ETFQA_FIX1,exr2,2000,FIX_WaitExecutionReport,quickfix.fix50.ExecutionReport,check3,,,${ord2},,*,[TradingParty_Trader1_and_counterparty],1,,,,${ord2},${ord2},${ord2},${ord2},,,,${ord2},${ord2},${ord2},${ord2},${ord2},${ord2},,,,*,,,,,,,,,*,NEW,,,,NEW,,,,,,,,${ord2:OrderQty},0,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '11,,2,y,,Count ER-s.,ETFQA_FIX1,,500,FIX_CountExecutionReport,quickfix.fix50.ExecutionReport,check2,,,,,,,,,,,,362587,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '12,,,y,,Get checkpoint,,check4,,GetCheckPoint,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '13,,,y,,Amend order 2: 100@97.2 -> 500@97.4,ETFQA_FIX1,amd1,,FIX_SendOrderCancelReplaceRequest,quickfix.fix50.OrderCancelReplaceRequest,,,,#{222ClOrdID()2222},,${exr2},,,,,,Lit_Day_B1,362587,8,LIMIT,,,,BUY,500,500,97.4,,,new Date(),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '14,,,y,,ER for order 2 with ExecType=Replaced,ETFQA_FIX1,exr2b,2000,FIX_WaitExecutionReport,quickfix.fix50.ExecutionReport,check4,,,${amd1},,${amd1},[TradingParty_Trader1],1,,,,${amd1},${amd1},${amd1},${amd1},,,,${amd1},${amd1},${amd1},${amd1},${exr2},${exr2},,,,*,,,,,,,,,*,REPLACED,,,,NEW,,,,,,,,${amd1:OrderQty},0,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '15,,,y,,ER for order 2 with Status=PartiallyFilled. Trade 200@97.4 is occurred,ETFQA_FIX1,exr2c,2000,FIX_WaitExecutionReport,quickfix.fix50.ExecutionReport,check4,,,${exr2b},,${exr2b},[TradingParty_Trader1_and_counterparty],2,,,,${exr2b},${exr2b},${exr2b},${exr2b},,,,${exr2b},${exr2b},${amd1}-${exr1},${exr2b},${exr2b},${exr2b},,,,*,,,,,,,,,*,TRADE,,,,PARTIALLY_FILLED,,,,${ord1:OrderQty},${ord1:Price},,,${amd1:OrderQty}-${ord1:OrderQty},${ord1:OrderQty},R,,${ord1:Price},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '16,,,y,,ER for order 1 with Status=Filled. Trade 200@97.4 is occurred,ETFQA_FIX1,exr1a,2000,FIX_WaitExecutionReport,quickfix.fix50.ExecutionReport,check4,,,${exr1},,${exr1},[TradingParty_Trader1_and_counterparty],2,,,,${exr1},${exr1},${exr1},${exr1},,,,${exr1},${exr1},${exr1}-${exr1},${exr1},${exr1},${exr1},,,,*,,,,,,,,,*,TRADE,${exr2c:TrdMatchID},,,FILLED,,,,${ord1:OrderQty},${ord1:Price},,,${ord1:OrderQty}-${ord1:OrderQty},${ord1:OrderQty},A,,${ord1:Price},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '17,,,y,,TCR for Sell order (order 1),ETFQA_PT1,tcr1,2000,FIX_WaitTradeCaptureReport,quickfix.fix50.TradeCaptureReport,check4,,9,,,,,,,,,,362587,8,,,,,,,,,,,*,,,*,,,,,,,,,,TRADE,,,,,,,,${ord1:OrderQty},${ord1:Price},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,CONTINUOUS_TRADING,REGULAR_TRADE,[SecurityAltID_1],1,,,TF,ETF,,,,,,,,,,,,,,N,,*,${exr2c:TrdMatchID},*,,,TRADE_CONFIRMATION,SUBMIT,CLEARED,YES,,,NEW,MATCHED,,PER_UNIT,*,,,,,,,,,,[TCR_SellSide_Trade1],,,,,,,,,,,,,,\r\n';
	test4 += '18,,,y,,TCR for Buy order (order 2),ETFQA_PT1,tcr2,2000,FIX_WaitTradeCaptureReport,quickfix.fix50.TradeCaptureReport,check4,,9,,,,,,,,,,362587,8,,,,,,,,,,,*,,,*,,,,,,,,,,TRADE,,,,,,,,${ord1:OrderQty},${ord1:Price},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,CONTINUOUS_TRADING,REGULAR_TRADE,[SecurityAltID_1],1,,,TF,ETF,,,,,,,,,,,,,,N,,*,${exr1a:TrdMatchID},*,,,TRADE_CONFIRMATION,SUBMIT,CLEARED,YES,,,NEW,MATCHED,,PER_UNIT,*,,,,,,,,,,[TCR_BuySide_Trade1],,,,,,,,,,,,,,\r\n';
	test4 += '19,,3,y,,Count ER-s.,ETFQA_FIX1,,500,FIX_CountExecutionReport,quickfix.fix50.ExecutionReport,check4,,,,,,,,,,,,362587,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '20,,2,y,,Count TCR-s.,ETFQA_PT1,,500,FIX_CountTradeCaptureReport,quickfix.fix50.TradeCaptureReport,check4,,,,,,,,,,,,362587,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '21,,,y,,Get checkpoint,,check5,,GetCheckPoint,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '22,,,y,,Cancel order 2,ETFQA_FIX1,can1,,FIX_SendOrderCancelRequest,quickfix.fix50.OrderCancelRequest,,,,#{ClOrdID()},,${exr2b},[TradingParty_Trader1],,,,,,362587,8,,,,,BUY,,,,,,new Date(),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '23,,,y,,ER for order 2 with Status=Cancelled,ETFQA_FIX1,exr2d,2000,FIX_WaitExecutionReport,quickfix.fix50.ExecutionReport,check5,,,${can1},,${exr2b},[TradingParty_Trader1],2,,,,${exr2b},${exr2b},${exr2b},${exr2b},,,,${exr2b},${exr2b},0,${exr2b},${exr2b},${exr2b},,,,*,,,,,,,,,*,CANCELLED,,,,CANCELLED,,,,,,,,0,${ord1:OrderQty},,,${ord1:Price},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '24,,1,y,,Count ER-s.,ETFQA_FIX1,,500,FIX_CountExecutionReport,quickfix.fix50.ExecutionReport,check5,,,,,,,,,,,,36258777,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';
	test4 += '24,,1,y,,Count ER-s.,ETFQA_FIX1,,500,FIX_CountExecutionReport2,quickfix.fix50.ExecutionReport,check5,,,,,,[TradingParty_Trader1],,,,,,362587,,,,,,,,,,,,,,,,,,[TargetParty_Firm1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[QuoteEntries_1],,,,,,,,[SecurityAltID_1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[TCR_BuySide_Trade1],,,,,,,,,,,,,,\r\n';
	test4 += '24,,1,y,,Count ER-s.,ETFQA_FIX1,,500,FIX_CountExecutionReport2,quickfix.fix50.ExecutionReport,check5,,,,,,[TradingParty_Trader1_and_counterparty],,,,,,,,,,,,,,,,,,,,,,,,[TargetParty_Firm1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[QuoteEntries_1],,,,,,,,[SecurityAltID_1],,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[TCR_SellSide_Trade1],,,,,,,,,,,,,,\r\n';
	test4 += ',,,,,,,,,test case end,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n';

	data = test4t;
	for (var i=1 ; i--; ){
		data += test4;
	}

	return data;
}


var FileSystem = {
	currentDriver: null,
	regFile : /([^\\]+)$/,
	regDir : /([^\\]+)\\$/,
	driverList: ["request", "manual", "mozilla", "applet", "javaLiveConnect", "activeX"],

	// Loads the contents of a text file from the local file system
	// filePath is the path to the file in these formats:
	//    x:\path\path\path\filename - PC local file
	//    \\server\share\path\path\path\filename - PC network file
	//    /path/path/path/filename - Mac/Unix local file
	// returns the text of the file, or null if the operation cannot be performed or false if there was an error
	load: function(filePath) {
		return this.getDriver().loadFile(filePath);
	},
	// Saves a string to a text file on the local file system
	// filePath is the path to the file in the format described above
	// content is the string to save
	// returns true if the file was saved successfully, or null if the operation cannot be performed or false if there was an error
	save: function(filePath,content) {
		return this.getDriver().saveFile(filePath,content);
	},
	// Copies a file on the local file system
	// dest is the path to the destination file in the format described above
	// source is the path to the source file in the format described above
	// returns true if the file was copied successfully, or null if the operation cannot be performed or false if there was an error
	copy: function(dest,source) {
		if(this.getDriver().copyFile)
			return this.currentDriver.copyFile(dest,source);
		else
			return null;
	},
	// Dir
	dir: function(path) {
		return this.getDriver().readDir(path);
	},

	// Rows delim
	rowsSep: function() {
		return this.getDriver().rowsSep;
	},

	// Converts a local file path from the format returned by document.location into the format expected by this plugin
	// url is the original URL of the file
	// returns the equivalent local file path
	convertUriToLocalPath: function (url) {
		// Remove any location or query part of the URL
		var originalPath = url.split("#")[0].split("?")[0];
		// Convert file://localhost/ to file:///
		if(originalPath.indexOf("file://localhost/") == 0)
			originalPath = "file://" + originalPath.substr(16);
		// Convert to a native file format
		//# "file:///x:/path/path/path..." - pc local file --> "x:\path\path\path..."
		//# "file://///server/share/path/path/path..." - FireFox pc network file --> "\\server\share\path\path\path..."
		//# "file:///path/path/path..." - mac/unix local file --> "/path/path/path..."
		//# "file://server/share/path/path/path..." - pc network file --> "\\server\share\path\path\path..."
		var localPath;
		if(originalPath.charAt(9) == ":") // PC local file
			localPath = unescape(originalPath.substr(8)).replace(new RegExp("/","g"),"\\");
		else if(originalPath.indexOf("file://///") == 0) // Firefox PC network file
			localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/","g"),"\\");
		else if(originalPath.indexOf("file:///") == 0) // Mac/UNIX local file
			localPath = unescape(originalPath.substr(7));
		else if(originalPath.indexOf("file:/") == 0) // Mac/UNIX local file
			localPath = unescape(originalPath.substr(5));
		else if(originalPath.indexOf("//") == 0) // PC network file
			localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/","g"),"\\");
		return localPath || originalPath;
	},

	// Private functions

	// Returns a reference to the current driver
	getDriver: function() {
		return drivers["request"]
		if(this.currentDriver === null) {
			for(var t=0; t<this.driverList.length; t++) {
				if(this.currentDriver === null && drivers[this.driverList[t]].isAvailable && drivers[this.driverList[t]].isAvailable())
					this.currentDriver = drivers[this.driverList[t]];
			}
		}
		return this.currentDriver;
	}
}

// Private driver implementations for each browser

var drivers = {};

var request = new XMLHttpRequest();

// Request driver
drivers.request = {
	name: "request",
	rowsSep: "\r\n",
	isAvailable: function() {
		return request.readyState >= 0
	},

	loadFile: (path) => {
		var body = {path}
		request.open('POST', '/api/loadfile', false);
		request.setRequestHeader('Content-Type', 'application/json')
		request.send(JSON.stringify(body));

		if (request.status === 200) {
			let res = request.responseText
			if (res.startsWith('ERROR'))
				console.log(res);
			else
		  	return res
		}
	},

	readDir: function(path) {
		var array = {
			files : [],
			dirs : [],
		}
		var body = {path}
		request.open('POST', '/api/readdir', false);
		request.setRequestHeader('Content-Type', 'application/json')
		request.send(JSON.stringify(body));

		if (request.status !== 200) throw ("Cannot on readdir fetching. " + err)

		var list = JSON.parse(request.responseText)
		for (var i=0, len=list.length; i<len; i++) {
			var value = list[i]

			if (value.indexOf('.') == -1)
				array.dirs.push(value)
			else
				array.files.push(value)
		}
		return array;
	},

	saveFile: function(path, content) {
		var body = {path, content}
		request.open('POST', '/api/savefile', false);
		request.setRequestHeader('Content-Type', 'application/json')
		request.send(JSON.stringify(body));

		if (request.status !== 200) throw ("Cannot on savefile. " + err)

		return null;
	},
}
// const libPath = '../../BIT_Test Library_20121022_original'
// console.log(drivers.request.readDir('../../BIT_Test Library_20121022_original'))
// console.log(drivers.request.loadFile(libPath + '/ETF_TS1_FIX_CINA.csv'));
// Manual functions

drivers.manual = {
	name: "manual",
	rowsSep: "\r\n",
	isAvailable: function() {
		return FILE_MANUAL;
	},
	loadFile: function(filePath) {
		var html = $("#MANUAL_LOAD").html();
		return html;
		//return loadManual(filePath);
	},
	saveFile: function(filePath,content) {
		var div = $("<div></div>"),
			html = "<table border=1>";

		div.css({
			width: "100%",
			height: "100%",
			background: "white",
			color: "black",
			zIndex: 999999,
			position: "absolute",
			overflow: "auto",
			//word-wrap:
		});

		for (var i=0, len=content.length; i<len; i++) {
			html += "<tr>";
			for (var j=0, len2=content[i].length; j<len2;j++) {
				html += "<td>" + (content[i][j] || "") + "</td>";
			}
			html += "</tr>";
		}
		html += "</table>";

		div.html(html);
		$(document.body).append(div);
	},
	readDir: function(path) {
		var array = {
			files : [],
			dirs : [],
		}
		var list = document.applets["applet"].listFiles(path);
		for (var i=0, len=list.length; i<len; i++) {
			var value = list[i];

			if (res = FileSystem.regDir.exec(value))
				array.dirs.push(res[1]);
			else if (res = FileSystem.regFile.exec(value))
				array.files.push(res[1]);
		}

		return array;
	}
}

// Internet Explorer driver
drivers.activeX = {
	name: "activeX",
	isAvailable: function() {
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
		} catch(ex) {
			return false;
		}
		return true;
	},
	loadFile: function(filePath) {
		// Returns null if it can't do it, false if there's an error, or a string of the content if successful
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var file = fso.OpenTextFile(filePath,1);
			var content = file.ReadAll();
			file.Close();
		} catch(ex) {
			//# alert("Exception while attempting to load\n\n" + ex.toString());
			return null;
		}
		return content;
	},
	createPath: function(path) {
		//# Remove the filename, if present. Use trailing slash (i.e. "foo\bar\") if no filename.
		var pos = path.lastIndexOf("\\");
		if(pos!=-1)
			path = path.substring(0,pos+1);
		//# Walk up the path until we find a folder that exists
		var scan = [path];
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var parent = fso.GetParentFolderName(path);
			while(parent && !fso.FolderExists(parent)) {
				scan.push(parent);
				parent = fso.GetParentFolderName(parent);
			}
			//# Walk back down the path, creating folders
			for(i=scan.length-1;i>=0;i--) {
				if(!fso.FolderExists(scan[i])) {
					fso.CreateFolder(scan[i]);
				}
			}
			return true;
		} catch(ex) {
		}
		return false;
	},
	copyFile: function(dest,source) {
		drivers.activeX.createPath(dest);
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.GetFile(source).Copy(dest);
		} catch(ex) {
			return false;
		}
		return true;
	},
	saveFile: function(filePath,content) {
		// Returns null if it can't do it, false if there's an error, true if it saved OK
		drivers.activeX.createPath(filePath);
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var file = fso.OpenTextFile(filePath,2,-1,0);
			file.Write(content);
			file.Close();
		} catch (ex) {
			return null;
		}
		return true;
	}
};

// Mozilla driver

drivers.mozilla = {
	name: "mozilla",
	rowsSep: "\r\n",
	isAvailable: function() {
		return !!window.Components;
	},
	readDir: function(path) {
		// Returns null if it can't do it, false if there's an error, or an object of the content if successful
		if(window.Components) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(path);
				if(!file.exists())
					return null;

				// file is the given directory (nsIFile)
				var entries = file.directoryEntries;
				var array = {
					dirs: [],
					files: []
				};
				while(entries.hasMoreElements())
				{
					var entry = entries.getNext().QueryInterface(Components.interfaces.nsILocalFile);
					if (entry.fileSize != 0)
						array.files.push(entry.leafName);
					else
						array.dirs.push(entry.leafName);
				}
				return array;
			} catch(ex) {
				console.log("Exception while attempting to load\n\n" + ex);
				return false;
			}
		}
		return null;
	},
	loadFile: function(filePath) {
		// Returns null if it can't do it, false if there's an error, or a string of the content if successful
		if(window.Components) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(filePath);
				if(!file.exists())
					return null;
				var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
				inputStream.init(file,0x01,00004,null);
				var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
				sInputStream.init(inputStream);
				var contents = sInputStream.read(sInputStream.available());
				sInputStream.close();
				inputStream.close();
				return contents;
			} catch(ex) {
				//# alert("Exception while attempting to load\n\n" + ex);
				return false;
			}
		}
		return null;
	},
	saveFile: function(filePath,content) {
		// Returns null if it can't do it, false if there's an error, true if it saved OK
		if(window.Components) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(filePath);
				if(!file.exists())
					file.create(0,0664);
				var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				out.init(file,0x20|0x02,00004,null);
				out.write(content,content.length);
				out.flush();
				out.close();
				return true;
			} catch(ex) {
				alert("Exception while attempting to save\n\n" + ex);
				return false;
			}
		}
		return null;
	}
};


drivers.applet = {
	name: "applet",
	rowsSep: "\n",
	deferredInit: function() {
		if(!document.applets["applet"] && !$.browser.mozilla && !$.browser.msie && document.location.toString().substr(0,5) == "file:") {
			$(document.body).append("<applet style='position:absolute;left:-1px' name='applet' id='applet' code='com\\heeere\\fileaccessapplet\\FacadeApplet.class' archive='FileAccessApplet-1.0.jar' width='1' height='1' mayscript='true'></applet>");
		}
	},
	isAvailable: function() {
		var av = !!document.applets["applet"];
		return !!document.applets["applet"];
	},
	loadFile: function(filePath) {
		var r;
		try {
			if(document.applets["applet"]) {
				r = document.applets["applet"].readFile(javaUrlToFilename(filePath));
				return (r === undefined || r === null) ? null : String(r);
			}
		} catch(ex) {
		}
		return null;
	},
	saveFile: function(filePath,content) {
		try {
			if(document.applets["applet"])
				return document.applets["applet"].writeFile(content, javaUrlToFilename(filePath));
		} catch(ex) {
		}
		return null;
	},
	readDir: function(path) {
		var array = {
			files : [],
			dirs : [],
		}
		var list = document.applets["applet"].listFiles(path);
		for (var i=0, len=list.length; i<len; i++) {
			var value = list[i];

			if (res = FileSystem.regDir.exec(value))
				array.dirs.push(res[1]);
			else if (res = FileSystem.regFile.exec(value))
				array.files.push(res[1]);
		}

		return array;
	}
}

// Java LiveConnect driver

drivers.javaLiveConnect = {
	name: "javaLiveConnect",
	isAvailable: function() {
		return !!window.java && !!window.java.io && !!window.java.io.FileReader;
	},
	loadFile: function(filePath) {
		var r;
		var content = [];
		try {
			r = new java.io.BufferedReader(new java.io.FileReader(javaUrlToFilename(filePath)));
			var line;
			while((line = r.readLine()) != null)
				content.push(new String(line));
			r.close();
		} catch(ex) {
			return null;
		}
		return content.join("\n") + "\n";
	},
	saveFile: function(filePath,content) {
		try {
			var s = new java.io.PrintStream(new java.io.FileOutputStream(javaUrlToFilename(filePath)));
			s.print(content);
			s.close();
			console.log("save from Live");
		} catch(ex) {
			return null;
		}
		return true;
	}
}


// Deferred initialisation for any drivers that need it

for(var t in drivers) {
	if(drivers[t].deferredInit)
		drivers[t].deferredInit();
}

// Private utilities

function javaUrlToFilename(url) {
	var f = "//localhost";
	if(url.indexOf(f) == 0)
			return url.substring(f.length);
	var i = url.indexOf(":");
	return i > 0 ? url.substring(i-1) : url;
}
