'use client'

import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { eachDayOfInterval, addDays, format, startOfWeek } from "date-fns";
import { getClassSectionsByWeek } from "@/app/actions/getClassSectionsByWeek";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { DAY_NAMES } from "@/constants/day-names";
import Modal from "@/components/Dialog/modal";

export const EventContext = React.createContext<any>(null);

export default function Calendar() {

  const weekStart = startOfWeek(Date.now());
  const initialConfig: DayPilot.CalendarConfig = {
    viewType: "Week",
    startDate: weekStart.toLocaleString(),
    locale: "en-us"
  };

  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [config] = useState(initialConfig);
  const [startDate, setStartDate] = useState(weekStart);
  const [modalData, setModalData] = useState<any>();


  useEffect( () => {
    if ( !calendar || calendar?.disposed() ) {
      return;
    }

    const flattenSections = ( data: any[] ) => {
      const events = [];
      for ( const item of data ) {
        if ( item.section ) {
          for ( const session of item.section ) {
            const itemCopy = { ...item };
            delete itemCopy.section;
            events.push( {
              ...itemCopy,
              ...session
            } );
          }
        }
      }
      return events;
    };

    const formatEventDateTime = ( event: any, formattedDate: string ) => {
      return {
        ...event,
        startTime: `${formattedDate}T${new Date(event.startTime).toLocaleTimeString( "en-US", {
          hourCycle: "h24",
          timeStyle: "medium"
        })}`,
        endTime: `${formattedDate}T${new Date(event.endTime).toLocaleTimeString( "en-US", {
          hourCycle: "h24",
          timeStyle: "medium"
        })}`
      };
    };

    const createCalendarEvent = ( event: any, idx: number, formattedDate: string ): DayPilot.EventData => {
      const formattedEvent = formatEventDateTime( event, formattedDate );
      return {
        id: idx,
        start: formattedEvent.startTime,
        end: formattedEvent.endTime,
        text: event.name
      };
    };

    const transformToCalendarEvents = ( events: any[] ): DayPilot.EventData[] => {
      return events.map( ( event, idx ) => {
        const dayNumber = DAY_NAMES.indexOf( event.day as string );
        const week = eachDayOfInterval( {
          start: new Date( startDate ),
          end: addDays( new Date( startDate ), 6 ),
        } )

        const dayOfWeek = week.find( ( day ) => day.getDay() === dayNumber );

        if( dayOfWeek === undefined ) throw new Error(
          "Day not found in the week"
        )
        const formattedDate = format( dayOfWeek, "yyyy-MM-dd" );

        return createCalendarEvent( event, idx, formattedDate );
      } );
    };

    getClassSectionsByWeek().then( ( data ) => {
      const flattenedEvents = flattenSections( data );
      const calendarEvents = transformToCalendarEvents( flattenedEvents );
      calendar.update( { events: calendarEvents } );
    } );

  }, [ calendar, startDate ] );

  const handleEventClick = ( (event: { e: { data: any; }; }) => {
    setModalData(event.e.data);
  } )

  const value = useMemo(
    () => ({
      modalData,
      setModalData
    }), [modalData]
  )

  return (
    <div className="container flex flex-row gap-4">
      <div>
        <DayPilotNavigator
        onTimeRangeSelected={(args) => {
          setStartDate(startOfWeek(args.day as SetStateAction<any>));
        }}
      /></div>
      <div>
        <DayPilotCalendar
          {...config}
          controlRef={setCalendar}
          startDate={startDate as unknown as string}
          onEventClick={handleEventClick}
        />
      </div>
      { modalData &&
        <EventContext value={ value }>
          <Modal />
        </EventContext>
      }
    </div>
  )
}
