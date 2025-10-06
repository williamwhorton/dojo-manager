'use client';

import React, { SetStateAction, useEffect, useState } from "react";
import { eachDayOfInterval, addDays, format, startOfWeek, DateArg } from "date-fns";
import { getClassSectionsByWeek } from "@/app/actions/getClassSectionsByWeek";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { DAY_NAMES } from "@/constants/day-names";

export default function Calendar() {

  const weekStart = startOfWeek(Date.now());
  const initialConfig: DayPilot.CalendarConfig = {
    viewType: "Week",
    startDate: weekStart.toString(),
    locale: "en-us"
  };

  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [config, setConfig] = useState(initialConfig);
  const [startDate, setStartDate] = useState(weekStart);



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
        startTime: `${formattedDate}T${event.startTime}`,
        endTime: `${formattedDate}T${event.endTime}`
      };
    };

    const createCalendarEvent = ( event: any, idx: number, formattedDate: string ): DayPilot.EventData => {
      const formattedEvent = formatEventDateTime( event, formattedDate );
      return {
        id: idx,
        start: formattedEvent.startTime,
        end: formattedEvent.endTime,
        text: event.name,
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

  return (
    <div>
      <DayPilotNavigator
        onTimeRangeSelected={(args) => {
          setStartDate(startOfWeek(args.day as SetStateAction<any>));
        }}
      />
      <DayPilotCalendar
        {...config}
        controlRef={setCalendar}
        startDate={startDate as unknown as string}
      />
    </div>
  )
}
